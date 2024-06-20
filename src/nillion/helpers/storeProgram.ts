import { config } from './nillion';
import * as nillion from '@nillion/client';

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
    const user_id = nillionClient.user_id;
    const compiledProgram = await fetch(`./programs/${programName}.nada.bin`);

    // transform the nada.bin into Uint8Array
    const arrayBufferProgram = await compiledProgram.arrayBuffer();
    const uint8Program = new Uint8Array(arrayBufferProgram);

    // store program
    const program_id = await nillionClient.store_program(
      config.clusterId,
      programName,
      uint8Program,
      receipt
    );
    return program_id;
  } catch (error) {
    console.log(error);
    return 'error';
  }
}
