import React, { useEffect, useState } from 'react';
import { NillionClient } from '@nillion/client-web';
import StoreSecretForm from './nillion/components/StoreSecretForm';
import RetrieveSecret from './nillion/components/RetrieveSecretForm';
import {
  readStorageForUserAtPage,
  updateStorageForUserAtPage,
} from './nillion/helpers/localStorage';
import UpdateSecretForm from './nillion/components/UpdateSecretForm';
import StoreProgram from './nillion/components/StoreProgramForm';
import ConnectionSection from './nillion/components/ConnectClient';
import { Container, Box, Tabs, Tab, Typography } from '@mui/material';

export default function Main() {
  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [storedSecretInfo, setStoredSecretInfo] = useState<any>({});
  const [localStorageStoredSecrets, setLocalStorageStoredSecrets] =
    useState<any>({});
  const localStoragePageName = 'main-flow';
  const [tabIndex, setTabIndex] = useState(0);

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

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container>
      <h1>Nillion Operations</h1>
      <p>
        Connect to Nillion with a user key, then experiment by performing
        different operations.
      </p>
      <ConnectionSection
        client={client}
        userkey={userkey}
        setUserKey={setUserKey}
        setClient={setClient}
      />

      {client && (
        <Box py={4} mb={8}>
          <h1>Perform a Nillion Operation</h1>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="Nillion operation tabs"
          >
            <Tab label="Store Secret Blob" />
            <Tab label="Store Secret Integer" />
            <Tab label="Retrieve Secret" />
            <Tab label="Update Secret" />
            <Tab label="Store Program" />
          </Tabs>

          <Box hidden={tabIndex !== 0} py={3}>
            <Typography component="div">
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
            </Typography>
          </Box>

          <Box hidden={tabIndex !== 1} py={3}>
            <Typography component="div">
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
            </Typography>
          </Box>

          <Box hidden={tabIndex !== 2} py={3}>
            <Typography component="div">
              <h2>Retrieve Secret</h2>
              <RetrieveSecret nillionClient={client} />
            </Typography>
          </Box>

          <Box hidden={tabIndex !== 3} py={3}>
            <Typography component="div">
              <h2>Update Secret</h2>
              <UpdateSecretForm
                secretName={''}
                onNewStoredSecret={handleNewStoredSecret}
                nillionClient={client}
                customSecretName
                itemName=""
              />
            </Typography>
          </Box>

          <Box hidden={tabIndex !== 4} py={3}>
            <Typography component="div">
              <h2>Store Program</h2>
              <StoreProgram
                nillionClient={client}
                defaultProgram="addition_simple"
              />
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
}
