import { NillionClient } from '@nillion/client-web';
import React, { useState, useEffect } from 'react';
import { config } from '../helpers/nillion';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { truncateString } from '../helpers/truncateString';
import CopyableString from './CopyableString';

interface ConnectionInfoProps {
  client: NillionClient | null;
  userkey: string | null;
}

const ConnectionInfo: React.FC<ConnectionInfoProps> = ({ client, userkey }) => {
  return (
    <Box mb={2}>
      <List>
        <ListItem>
          <ListItemText>
            <strong>Cluster ID:</strong>{' '}
            {config.clusterId ? (
              <CopyableString
                text={config.clusterId}
                copyText={config.clusterId}
                shouldTruncate={false}
                descriptor="cluster id"
              />
            ) : (
              'Not set - update your .env file with Nillion network values'
            )}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>User Key:</strong>{' '}
            {userkey ? (
              <CopyableString
                text={userkey}
                copyText={userkey}
                shouldTruncate={true}
                truncateLength={10}
                descriptor="user key"
              />
            ) : (
              'Not set - generate a Nillion userkey then connect with the userkey'
            )}
          </ListItemText>
        </ListItem>

        <ListItem>
          <ListItemText>
            <strong>User ID:</strong>{' '}
            {client?.user_id ? (
              <CopyableString
                text={client?.user_id}
                copyText={client?.user_id}
                shouldTruncate={true}
                truncateLength={10}
                descriptor="user id"
              />
            ) : (
              'Not set'
            )}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>Party ID:</strong>{' '}
            {client?.party_id ? (
              <CopyableString
                copyText={client?.party_id}
                text={client?.party_id}
                shouldTruncate={true}
                truncateLength={10}
                descriptor="party id"
              />
            ) : (
              'Not set'
            )}
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
};

export default ConnectionInfo;
