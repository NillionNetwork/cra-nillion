import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { createNilChainClientAndKeplrWallet } from '../helpers/nillion';
import { getKeplr } from '../helpers/keplr';
import { SigningStargateClient } from '@cosmjs/stargate';

interface KeplrConnectButtonProps {
  setChainClient: (client: SigningStargateClient | null) => void;
  setWallet: (key: any | null) => void;
}

const KeplrConnectButton: React.FC<KeplrConnectButtonProps> = ({
  setChainClient,
  setWallet,
}) => {
  const [currentAccount, setCurrentAccount] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [foundKeplrWallet, setFoundKeplrWallet] = useState(false);

  useEffect(() => {
    const checkForKeplr = async () => {
      const keplr = await getKeplr();
      if (keplr) {
        setFoundKeplrWallet(true);
      }
    };
    checkForKeplr();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const [nilChainClient, nilChainWallet] =
        await createNilChainClientAndKeplrWallet();
      setChainClient(nilChainClient);
      setWallet(nilChainWallet);

      const [account] = await nilChainWallet.getAccounts();
      const currentAddress = account.address;
      setCurrentAccount(currentAddress);
    } catch (error) {
      console.error('Failed to connect wallet', error);
    }
    setLoading(false);
  };

  const handleDisconnect = () => {
    setChainClient(null);
    setWallet(null);
    setCurrentAccount(null);
  };

  return foundKeplrWallet ? (
    <>
      {!currentAccount ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? (
            <>
              Connecting... <CircularProgress size={24} />{' '}
            </>
          ) : (
            'Connect Nillion Wallet'
          )}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDisconnect}
        >
          Disconnect Nillion Wallet
        </Button>
      )}
    </>
  ) : (
    <a href="https://docs.nillion.com/guide-testnet-connect" target="_blank">
      <Button variant="contained" color="secondary">
        Create a Nillion Wallet
      </Button>
    </a>
  );
};

export default KeplrConnectButton;
