import React from 'react';
import { Box, Button, CircularProgress, List, ListItem } from '@mui/material';
import CopyableString from './CopyableString';
import ViewTransactionButton from './ViewTransactionButton';

interface Message {
  displayText: string;
  copyText: string | null;
}

interface PayButtonProps {
  buttonText: string;
  onClick: () => void;
  loading?: boolean;
  displayList?: boolean;
  listItems?: Message[];
  errorMessage: string | null;
  tx: string | null;
}

const PayButton: React.FC<PayButtonProps> = ({
  buttonText,
  onClick,
  loading = false,
  displayList = false,
  listItems = [],
  errorMessage,
  tx,
}) => {
  const errorListItems: Message[] = errorMessage
    ? [
        {
          displayText: errorMessage,
          copyText: errorMessage,
        },
        {
          displayText:
            'Use https://faucet.testnet.nillion.com to get more unil for your account',
          copyText: 'https://faucet.testnet.nillion.com',
        },
      ]
    : [];
  return (
    <Box>
      <Button variant="contained" color="primary" onClick={onClick}>
        {buttonText}
        {loading && (
          <CircularProgress
            size="14px"
            color="inherit"
            style={{ marginLeft: '10px' }}
          />
        )}
      </Button>
      {tx && <ViewTransactionButton tx={tx} />}
      {errorMessage && (
        <List>
          {errorListItems.map((item, index) => (
            <ListItem key={index}>
              <CopyableString
                text={item.displayText || ''}
                copyText={item.copyText || ''}
                shouldTruncate={false}
              />
            </ListItem>
          ))}
        </List>
      )}
      {displayList && listItems && listItems.length > 0 && (
        <List>
          {listItems.map((item, index) => (
            <ListItem key={index}>
              <CopyableString
                text={item.displayText || ''}
                copyText={item.copyText || ''}
                shouldTruncate={false}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PayButton;
