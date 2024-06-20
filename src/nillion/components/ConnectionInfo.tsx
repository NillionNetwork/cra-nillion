import { NillionClient } from '@nillion/client';
import React, { useState } from 'react';
import { config } from '../helpers/nillion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface ConnectionInfoProps {
  client: NillionClient | null;
  userkey: string | null;
}

const ConnectionInfo: React.FC<ConnectionInfoProps> = ({ client, userkey }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Box my={2}>
      <h3>NillionClient is {client ? 'connected 🟢' : 'not connected 🔴'}</h3>
      {isVisible && (
        <Box mb={2}>
          <List>
            <ListItem>
              <ListItemText
                primary={`Cluster ID: ${config.clusterId || 'Not set'}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={`User Key: ${userkey || 'Not set'}`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`User ID: ${client?.user_id || 'Not set'}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Party ID: ${client?.party_id || 'Not set'}`}
              />
            </ListItem>
          </List>
        </Box>
      )}
      <Button variant="contained" color="secondary" onClick={toggleVisibility}>
        {isVisible ? 'Hide' : 'Show'} Connection Info
      </Button>
    </Box>
  );
};

export default ConnectionInfo;
