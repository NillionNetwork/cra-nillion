import React from 'react';
import { Button } from '@mui/material';

interface ViewTransactionButtonProps {
  tx: string;
  href?: string;
}

const ViewTransactionButton: React.FC<ViewTransactionButtonProps> = ({
  tx,
  href,
}) => {
  const defaultHref = `https://testnet.nillion.explorers.guru/transaction/${tx}`;
  const linkHref = href || defaultHref;

  return tx ? (
    <a href={linkHref} target="_blank" rel="noopener noreferrer">
      <Button variant="contained" color="secondary">
        View transaction on Block Explorer
      </Button>
    </a>
  ) : null;
};

export default ViewTransactionButton;
