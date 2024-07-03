import React, { useState } from 'react';
import ConnectionInfo from './ConnectionInfo';
import GenerateUserKey from './GenerateUserKey';
import CreateClient from './CreateClient';
import { NillionClient } from '@nillion/client-web';
import { Box, Button } from '@mui/material';

interface ConnectionSectionProps {
  client: NillionClient | null;
  userkey: string | null;
  setUserKey: React.Dispatch<React.SetStateAction<string | null>>;
  setClient: React.Dispatch<React.SetStateAction<NillionClient | null>>;
}

const ConnectionSection: React.FC<ConnectionSectionProps> = ({
  client,
  userkey,
  setUserKey,
  setClient,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Box my={2}>
      <h3>NillionClient is {client ? 'connected 🟢' : 'not connected 🔴'}</h3>

      <div>
        <ConnectionInfo client={client} userkey={userkey} />
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
