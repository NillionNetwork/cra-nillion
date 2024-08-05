import * as nillion from "@nillion/client-web";
import React, { useEffect, useRef, useState } from "react";
import { config } from "../helpers/nillion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const initializeNillionClient = (
  userkey: any,
  nodekey_seed?: string,
): nillion.NillionClient => {
  const nodeKey = nillion.NodeKey.from_seed(nodekey_seed || "");
  return new nillion.NillionClient(userkey, nodeKey, config.bootnodes);
};

interface CreateClientProps {
  userKey: string;
  setClient: (client: any) => void;
}

const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const CreateClient: React.FC<CreateClientProps> = ({ userKey, setClient }) => {
  const [seed, setSeed] = useState<string>("");
  const hasBeenSet = useRef(false);

  const defaultNodeKeySeed = `nillion-testnet-${generateRandomString(64)}`;

  const initializeNewClient = async () => {
    if (userKey) {
      console.info(`nodekey is: ${defaultNodeKeySeed}`);
      await nillion.default();
      const uk = nillion.UserKey.from_base58(userKey);
      const newClient = initializeNillionClient(uk, defaultNodeKeySeed);
      nillion.NillionClient.enable_remote_logging();
      setClient(newClient);
    }
  };

  useEffect(() => {
    if (!hasBeenSet.current) {
      initializeNewClient();
      hasBeenSet.current = true;
    }
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
