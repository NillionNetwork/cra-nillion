import React from 'react';
import { Box, Button, CircularProgress, List, ListItem } from '@mui/material';
import CopyableString from './CopyableString';

interface PayButtonProps {
  buttonText: string;
  onClick: () => void;
  loading?: boolean;
  displayList?: boolean;
  listItems?: { displayText: string; copyText: string }[];
}

const PayButton: React.FC<PayButtonProps> = ({
  buttonText,
  onClick,
  loading = false,
  displayList = false,
  listItems = [],
}) => {
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
      {displayList && listItems.length > 0 && (
        <List>
          {listItems.map((item, index) => (
            <ListItem key={index}>
              <CopyableString
                text={item.displayText}
                copyText={item.copyText}
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
