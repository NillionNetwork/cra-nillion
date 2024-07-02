import React, { useEffect, useState } from 'react';
import { NillionClient } from '@nillion/client-web';
import StoreSecretForm from './nillion/components/StoreSecretForm';
import RetrieveSecret from './nillion/components/RetrieveSecretForm';
import UpdateSecretForm from './nillion/components/UpdateSecretForm';
import StoreProgram from './nillion/components/StoreProgramForm';
import ConnectionSection from './nillion/components/ConnectClient';
import { Container, Box, Tabs, Tab, Typography } from '@mui/material';
import { SigningStargateClient } from '@cosmjs/stargate';

export default function Main() {
  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [nilchainClient, setNilchainClient] =
    useState<SigningStargateClient | null>(null);
  const [nillionWallet, setNillionWallet] = useState<any | null>(null);
  const [storedSecretInfo, setStoredSecretInfo] = useState<any>({});
  const [tabIndex, setTabIndex] = useState(0);

  const handleNewStoredSecret = (newSecretInfo: any) => {
    const storeId = newSecretInfo.storeId;

    setStoredSecretInfo((secrets: any) => ({
      ...secrets,
      [storeId]: { ...storedSecretInfo[storeId], ...newSecretInfo },
    }));
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
        setChainClient={setNilchainClient}
        setNillionWallet={setNillionWallet}
      />

      {client && nilchainClient && nillionWallet && (
        <Box py={1} mb={8}>
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
                nilchainClient={nilchainClient}
                nillionWallet={nillionWallet}
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
                nilchainClient={nilchainClient}
                nillionWallet={nillionWallet}
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
              <RetrieveSecret
                nillionClient={client}
                nilchainClient={nilchainClient}
                nillionWallet={nillionWallet}
              />
            </Typography>
          </Box>

          <Box hidden={tabIndex !== 3} py={3}>
            <Typography component="div">
              <h2>Update Secret</h2>
              <UpdateSecretForm
                secretName={''}
                onNewStoredSecret={handleNewStoredSecret}
                nillionClient={client}
                nilchainClient={nilchainClient}
                nillionWallet={nillionWallet}
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
                nilchainClient={nilchainClient}
                nillionWallet={nillionWallet}
                defaultProgram="addition_simple"
              />
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
}
