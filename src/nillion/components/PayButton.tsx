import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

interface PayButtonProps {
  buttonText: string;
  onClick: () => void;
  loading?: boolean;
  displayList?: boolean;
  listItems?: { primary: string }[];
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
              <ListItemText primary={item.primary} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PayButton;
