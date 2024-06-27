import React, { useEffect, useState } from 'react';
import GenerateUserKey from './nillion/components/GenerateUserKey';
import CreateClient from './nillion/components/CreateClient';
import * as nillion from '@nillion/client-web';

import { NillionClient, NadaValues } from '@nillion/client-web';
import StoreSecretForm from './nillion/components/StoreSecretForm';
import StoreProgram from './nillion/components/StoreProgramForm';
import ComputeForm from './nillion/components/ComputeForm';
import ConnectionInfo from './nillion/components/ConnectionInfo';

export default function Main() {
  const programName = 'addition_simple';
  const outputName = 'my_output';
  const partyName = 'Party1';
  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [storeId_my_int1, setStoreId_my_int1] = useState<string | null>(null);
  const [storeId_my_int2, setStoreId_my_int2] = useState<string | null>(null);
  const [programId, setProgramId] = useState<string | null>(null);
  const [additionalComputeValues, setAdditionalComputeValues] =
    useState<NadaValues | null>(null);
  const [computeResult, setComputeResult] = useState<string | null>(null);

  useEffect(() => {
    if (userkey && client) {
      setUserId(client.user_id);
      setPartyId(client.party_id);
      const additionalComputeValues = new nillion.NadaValues();
      setAdditionalComputeValues(additionalComputeValues);
    }
  }, [userkey, client]);

  return (
    <div>
      <h1>Blind Computation Demo</h1>
      <p>
        Connect to Nillion with a user key, then follow the steps to store a
        program, store secrets, and compute on the secrets.
      </p>
      <ConnectionInfo client={client} userkey={userkey} />

      <h1>1. Connect to Nillion Client {client && ' ✅'}</h1>
      <GenerateUserKey setUserKey={setUserKey} />

      {userkey && <CreateClient userKey={userkey} setClient={setClient} />}
      <br />
      <h1>2. Store Program {programId && ' ✅'}</h1>
      {client && (
        <>
          <StoreProgram
            nillionClient={client}
            defaultProgram={programName}
            onNewStoredProgram={(program) => setProgramId(program.program_id)}
          />
        </>
      )}
      <br />
      <h1>3. Store Secrets {storeId_my_int1 && storeId_my_int2 && ' ✅'}</h1>
      {userId && programId && (
        <>
          <h2>Store my_int1 {storeId_my_int1 && ' ✅'}</h2>
          <StoreSecretForm
            secretName={'my_int1'}
            onNewStoredSecret={(secret) => setStoreId_my_int1(secret.storeId)}
            nillionClient={client}
            secretType="SecretInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={userId}
            defaultProgramIdForComputePermissions={programId}
          />

          <h2>Store my_int2 {storeId_my_int2 && ' ✅'}</h2>
          <StoreSecretForm
            secretName={'my_int2'}
            onNewStoredSecret={(secret) => setStoreId_my_int2(secret.storeId)}
            nillionClient={client}
            secretType="SecretInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={userId}
            defaultProgramIdForComputePermissions={programId}
          />
        </>
      )}
      <br />
      <h1>4. Compute {computeResult && ' ✅'}</h1>
      {client &&
        programId &&
        storeId_my_int1 &&
        storeId_my_int2 &&
        partyId &&
        additionalComputeValues && (
          <ComputeForm
            nillionClient={client}
            programId={programId}
            additionalComputeValues={additionalComputeValues}
            storeIds={[storeId_my_int1, storeId_my_int2]}
            inputParties={[{ partyName, partyId }]}
            outputParties={[{ partyName, partyId }]}
            outputName={outputName}
            onComputeProgram={(result) => setComputeResult(result.value)}
          />
        )}
      <br />
    </div>
  );
}
