import * as nillion from '@nillion/client-web';
import React, { useState, useEffect } from 'react';
import { config } from '../helpers/nillion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const initializeNillionClient = (
  userkey: any,
  nodekey_seed?: string
): nillion.NillionClient => {
  const nodeKey = nillion.NodeKey.from_seed(nodekey_seed || '');
  return new nillion.NillionClient(userkey, nodeKey, config.bootnodes);
};

interface CreateClientProps {
  userKey: string;
  setClient: (client: any) => void;
}

const CreateClient: React.FC<CreateClientProps> = ({ userKey, setClient }) => {
  const [seed, setSeed] = useState<string>('');
  const defaultNodeKeySeed = `nillion-testnet-seed-${Math.floor(Math.random() * 10) + 1}`;

  const initializeNewClient = async () => {
    if (userKey) {
      await nillion.default();
      const uk = nillion.UserKey.from_base58(userKey);
      const newClient = await initializeNillionClient(uk, defaultNodeKeySeed);
      setClient(newClient);
    }
  };

  useEffect(() => {
    initializeNewClient();
  }, [userKey]);

  const handleClientNodeKeyUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    await initializeNewClient();
  };

  const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value);
  };

  return (
    <Box my={2}>
      <h3>Optional: Seed Node Key</h3>
      <p>
        Optionally update your node key using a seed. The seed creates a
        deterministic key pair, so that the node key's corresponding party id is
        predictable.
      </p>
      <form onSubmit={handleClientNodeKeyUpdate}>
        <TextField
          type="text"
          value={seed}
          onChange={handleSeedChange}
          placeholder="[Optional] seed nodekey"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="secondary">
          Update nodekey with seed {seed && `'${seed}'`}
        </Button>
      </form>
    </Box>
  );
};

export default CreateClient;
