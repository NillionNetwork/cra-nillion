import { config } from './nillion';
import * as nillion from '@nillion/client-web';

interface StoreSecrets {
  nillionClient: nillion.NillionClient;
  nillionSecrets: nillion.NadaValues;
  storeSecretsReceipt: nillion.PaymentReceipt;
  usersWithRetrievePermissions?: string[];
  usersWithUpdatePermissions?: string[];
  usersWithDeletePermissions?: string[];
  usersWithComputePermissions?: string[];
  programIdForComputePermissions?: string;
}

// Store Secrets that have already been paid for
export async function storeSecrets({
  nillionClient,
  nillionSecrets,
  storeSecretsReceipt,
  usersWithRetrievePermissions = [],
  usersWithUpdatePermissions = [],
  usersWithDeletePermissions = [],
  usersWithComputePermissions = [],
  programIdForComputePermissions,
}: StoreSecrets): Promise<any> {
  try {
    const user_id = nillionClient.user_id;

    // create a permissions object, give the storer default perissions
    const permissions = nillion.Permissions.default_for_user(user_id);

    // add retrieve permissions to the permissions object
    if (usersWithRetrievePermissions.length) {
      permissions.add_retrieve_permissions(usersWithRetrievePermissions);
    }

    // add update permissions to the permissions object
    if (usersWithUpdatePermissions.length) {
      permissions.add_update_permissions(usersWithUpdatePermissions);
    }

    // add delete permissions to the permissions object
    if (usersWithDeletePermissions.length) {
      permissions.add_delete_permissions(usersWithDeletePermissions);
    }

    // add compute permissions to the permissions object
    if (usersWithComputePermissions.length && programIdForComputePermissions) {
      const user_program_map = usersWithComputePermissions.reduce(
        (acc, userId) => ({
          ...acc,
          [userId]: [programIdForComputePermissions],
        }),
        {}
      );
      permissions.add_compute_permissions(user_program_map);
    }

    const store_id = await nillionClient.store_values(
      config.clusterId,
      nillionSecrets,
      permissions,
      storeSecretsReceipt
    );

    return store_id;
  } catch (error) {
    return error;
  }
}
