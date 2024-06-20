import React, { useEffect, useState } from 'react';
import GenerateUserKey from './nillion/components/GenerateUserKey';
import CreateClient from './nillion/components/CreateClient';
import { NillionClient } from '@nillion/client';
import StoreSecretForm from './nillion/components/StoreSecretForm';
import RetrieveSecret from './nillion/components/RetrieveSecretForm';
import {
  readStorageForUserAtPage,
  resetStorageForUserAtPage,
  updateStorageForUserAtPage,
} from './nillion/helpers/localStorage';
import UpdateSecretForm from './nillion/components/UpdateSecretForm';
import StoreProgram from './nillion/components/StoreProgramForm';
import ConnectionInfo from './nillion/components/ConnectionInfo';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function Main() {
  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [storedSecretInfo, setStoredSecretInfo] = useState<any>({});
  const [localStorageStoredSecrets, setLocalStorageStoredSecrets] =
    useState<any>({});
  const localStoragePageName = 'main-flow';

  useEffect(() => {
    if (userkey && client) {
      setUserId(client.user_id);
      setPartyId(client.party_id);

      const storedItems = readStorageForUserAtPage(
        client.user_id,
        localStoragePageName
      );
      if (storedItems && Object.keys(storedItems).length > 0) {
        setLocalStorageStoredSecrets(storedItems);
        setStoredSecretInfo(storedItems);
      }
    }
  }, [userkey, client]);

  const handleNewStoredSecret = (newSecretInfo: any) => {
    const storeId = newSecretInfo.storeId;

    setStoredSecretInfo((secrets: any) => ({
      ...secrets,
      [storeId]: { ...storedSecretInfo[storeId], ...newSecretInfo },
    }));

    if (userId) {
      updateStorageForUserAtPage(userId, localStoragePageName, {
        ...storedSecretInfo,
        [storeId]: { ...storedSecretInfo[storeId], ...newSecretInfo },
      });
    }
  };

  const handleLocalStorageReset = () => {
    if (client) {
      resetStorageForUserAtPage(client.user_id, localStoragePageName);
      setStoredSecretInfo({});
      setLocalStorageStoredSecrets({});
    }
  };

  return (
    <Container>
      <h1>Nillion Operations</h1>
      <p>
        Connect to Nillion with a user key, then experiment by performing
        different operations.
      </p>
      <ConnectionInfo client={client} userkey={userkey} />
      {/* {userId && client && (
        <>
          <h2>Stored Secrets</h2>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLocalStorageReset}
          >
            Reset local storage
          </Button>
          {Object.keys(storedSecretInfo).map((storeId) => {
            const secret = storedSecretInfo[storeId];
            return (
              <Paper
                key={storeId}
                elevation={3}
                sx={{ padding: 2, marginTop: 2 }}
              >
                <h3>storeId: {storeId}</h3>
                <List>
                  <ListItem>
                    <ListItemText primary={`name: ${secret.name}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`secretType: ${secret.secretType}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`usersWithRetrievePermissions: ${secret.usersWithRetrievePermissions?.join(', ')}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`usersWithUpdatePermissions: ${secret.usersWithUpdatePermissions?.join(', ')}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`usersWithDeletePermissions: ${secret.usersWithDeletePermissions?.join(', ')}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`usersWithComputePermissions: ${secret.usersWithComputePermissions?.join(', ')}`}
                    />
                  </ListItem>
                </List>
              </Paper>
            );
          })}
        </>
      )} */}
      <br />
      <br />
      <GenerateUserKey setUserKey={setUserKey} />

      {userkey && <CreateClient userKey={userkey} setClient={setClient} />}

      <br />
      <br />
      {client && (
        <>
          <h2>Store SecretBlob</h2>
          <StoreSecretForm
            secretName={''}
            onNewStoredSecret={handleNewStoredSecret}
            nillionClient={client}
            secretType="SecretBlob"
            isLoading={false}
            customSecretName
            itemName="secret blob"
          />

          <br />
          <br />
          <h2>Store SecretInteger</h2>
          <StoreSecretForm
            secretName={''}
            onNewStoredSecret={handleNewStoredSecret}
            nillionClient={client}
            secretType="SecretInteger"
            isLoading={false}
            customSecretName
            itemName="secret integer"
          />

          <br />
          <br />
          <h2>Retrieve Secret</h2>
          <RetrieveSecret nillionClient={client} />

          <br />
          <br />
          <h2>Update Secret</h2>
          <UpdateSecretForm
            secretName={''}
            onNewStoredSecret={handleNewStoredSecret}
            nillionClient={client}
            customSecretName
            itemName=""
          />

          <br />
          <br />
          <h2>Store Program</h2>
          <StoreProgram
            nillionClient={client}
            defaultProgram="addition_simple"
          />
        </>
      )}
    </Container>
  );
}
