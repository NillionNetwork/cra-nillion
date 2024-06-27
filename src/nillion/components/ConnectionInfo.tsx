import { NillionClient } from '@nillion/client-web';
import React, { useState, useEffect } from 'react';
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
  return (
    <Box mb={2}>
      <List>
        <ListItem>
          <ListItemText
            primary={`Cluster ID: ${config.clusterId || 'Not set - update your .env file with Nillion network values'}`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`User Key: ${userkey || 'Not set - generate a Nillion userkey then connect with the userkey'}`}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary={`User ID: ${client?.user_id || 'Not set'}`} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Party ID: ${client?.party_id || 'Not set'}`}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default ConnectionInfo;
