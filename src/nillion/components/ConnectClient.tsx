import React, { useEffect, useState } from 'react';
import ConnectionInfo from './ConnectionInfo';
import GenerateUserKey from './GenerateUserKey';
import CreateClient from './CreateClient';
import { NillionClient } from '@nillion/client-web';
import { Box, Button } from '@mui/material';
import KeplrConnectButton from './KeplrConnectButton';
import { SigningStargateClient } from '@cosmjs/stargate';

interface ConnectionSectionProps {
  client: NillionClient | null;
  userkey: string | null;
  setUserKey: React.Dispatch<React.SetStateAction<string | null>>;
  setClient: React.Dispatch<React.SetStateAction<NillionClient | null>>;
  setChainClient: (client: SigningStargateClient | null) => void;
  setNillionWallet: (wallet: any | null) => void;
}

const ConnectionSection: React.FC<ConnectionSectionProps> = ({
  client,
  userkey,
  setUserKey,
  setClient,
  setChainClient,
  setNillionWallet,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [connectedAddress, setConnectedAddress] = useState(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleChangeWallet = async (wallet: any) => {
    setNillionWallet(wallet);
    if (wallet) {
      const [account] = await wallet.getAccounts();
      setConnectedAddress(account.address);
    } else {
      setConnectedAddress(null);
    }
  };

  useEffect(() => {
    if (userkey) {
      setIsVisible(false);
    }
  }, [userkey]);

  return (
    <Box my={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h3>
          {' '}
          Nillion Wallet is{' '}
          {connectedAddress ? 'connected 🟢' : 'not connected 🔴'} |
          NillionClient is {client ? 'connected 🟢' : 'not connected 🔴'}
        </h3>
        <KeplrConnectButton
          setChainClient={setChainClient}
          setWallet={handleChangeWallet}
        />
      </Box>

      <div>
        <ConnectionInfo
          client={client}
          userkey={userkey}
          connectedAddress={connectedAddress}
        />
        {isVisible && (
          <>
            <GenerateUserKey setUserKey={setUserKey} />
            {userkey && (
              <CreateClient userKey={userkey} setClient={setClient} />
            )}
          </>
        )}
      </div>

      {client && (
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          👀 {isVisible ? 'Hide' : 'Show'} Nillion User and Node Key Connection
          Info
        </Button>
      )}
    </Box>
  );
};

export default ConnectionSection;
