import { config } from './nillion';
import * as nillion from '@nillion/client-web';
import { transformNadaProgramToUint8Array } from './transformNadaProgramToUint8Array';

interface StoreProgram {
  nillionClient: nillion.NillionClient;
  receipt: nillion.PaymentReceipt;
  programName: string; // ex: addition_simple
}

// Store Program
export async function storeProgram({
  nillionClient,
  receipt,
  programName,
}: StoreProgram): Promise<any> {
  try {
    const programBinary = await transformNadaProgramToUint8Array(
      `./programs/${programName}.nada.bin`
    );

    const program_id = await nillionClient.store_program(
      config.clusterId,
      programName,
      programBinary,
      receipt
    );
    return program_id;
  } catch (error) {
    return error;
  }
}
