import { config } from './nillion';
import * as nillion from '@nillion/client';

interface UpdateSecret {
  nillionClient: nillion.NillionClient;
  nillionSecrets: nillion.Secrets;
  storeSecretsReceipt: nillion.PaymentReceipt;
  storeId: string;
}

// Store Secrets that have already been paid for
export async function updateSecret({
  nillionClient,
  nillionSecrets,
  storeSecretsReceipt,
  storeId,
}: UpdateSecret): Promise<any> {
  try {
    const user_id = nillionClient.user_id;

    const result = await nillionClient.update_secrets(
      config.clusterId,
      storeId,
      nillionSecrets,
      storeSecretsReceipt
    );

    console.log(result, storeId);

    return storeId;
  } catch (error) {
    console.log(error);
    return 'error';
  }
}
