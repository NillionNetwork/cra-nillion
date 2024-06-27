import { config } from './nillion';
import * as nillion from '@nillion/client-web';

interface UpdateSecret {
  nillionClient: nillion.NillionClient;
  nillionSecrets: nillion.NadaValues;
  updateSecretsReceipt: nillion.PaymentReceipt;
  storeId: string;
}

// Store Secrets that have already been paid for
export async function updateSecret({
  nillionClient,
  nillionSecrets,
  updateSecretsReceipt,
  storeId,
}: UpdateSecret): Promise<any> {
  try {
    const user_id = nillionClient.user_id;

    const result = await nillionClient.update_values(
      config.clusterId,
      storeId,
      nillionSecrets,
      updateSecretsReceipt
    );

    return storeId;
  } catch (error) {
    return error;
  }
}
