import * as nillion from '@nillion/client-web';
import { config } from './nillion';

interface RetrieveSecret {
  nillionClient: nillion.NillionClient;
  store_id: string;
  secret_name: string;
  receipt: nillion.PaymentReceipt;
}
export async function retrieveSecret({
  nillionClient,
  store_id,
  secret_name,
  receipt,
}: RetrieveSecret) {
  const retrieved = await nillionClient.retrieve_value(
    config.clusterId,
    store_id,
    secret_name,
    receipt
  );

  try {
    const intValue = retrieved.to_integer();
    return intValue;
  } catch (err) {
    // gets byte array value
    const byteArraySecret = retrieved.to_byte_array();

    // decodes byte array to string
    const decoded = new TextDecoder('utf-8').decode(byteArraySecret);
    return decoded;
  }
}
