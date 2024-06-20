import { config } from './nillion';
import * as nillion from '@nillion/client';

interface ComputeProgram {
  nillionClient: nillion.NillionClient;
  receipt: nillion.PaymentReceipt;
  programId: string;
  storeIds: string[];
  inputParties: ComputeParty[];
  outputParties: ComputeParty[];
  outputName: string;
}

interface ComputeParty {
  partyName: string;
  partyId: string;
}

export async function computeProgram({
  nillionClient,
  receipt,
  programId,
  storeIds,
  inputParties,
  outputParties,
  outputName,
}: ComputeProgram): Promise<any> {
  await nillion.default();
  let program_bindings = new nillion.ProgramBindings(programId);
  inputParties.forEach(({ partyName, partyId }: ComputeParty) => {
    program_bindings.add_input_party(partyName, partyId);
  });

  outputParties.forEach(({ partyName, partyId }: ComputeParty) => {
    program_bindings.add_output_party(partyName, partyId);
  });

  try {
    const compute_time_secrets = new nillion.Secrets();
    const public_variables = new nillion.PublicVariables();

    const compute_result_uuid = await nillionClient.compute(
      config.clusterId,
      program_bindings,
      storeIds,
      compute_time_secrets,
      public_variables,
      receipt
    );

    const compute_result =
      await nillionClient.compute_result(compute_result_uuid);
    const result = compute_result[outputName].toString();
    return result;
  } catch (error) {
    console.log(error);
    return 'error';
  }
}
