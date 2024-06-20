import React, { useState } from 'react';
import * as nillion from '@nillion/client';
import { getQuote } from '../helpers/getQuote';
import {
  createNilChainClientAndWalletFromPrivateKey,
  payWithWalletFromPrivateKey,
} from '../helpers/nillion';
import { retrieveSecret } from '../helpers/retrieveSecret';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { List, ListItem, ListItemText } from '@mui/material';

interface RetrieveSecretProps {
  nillionClient: nillion.NillionClient;
}

const RetrieveSecret: React.FC<RetrieveSecretProps> = ({
  nillionClient,
}: RetrieveSecretProps) => {
  const [storeId, setStoreId] = useState('');
  const [secretName, setSecretName] = useState('');
  const [quote, setQuote] = useState<any | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<any | null>(null);
  const [retrievedValue, setRetrievedValue] = useState<string | null>(null);

  const handleGetQuoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nillionClient) {
      const operation = nillion.Operation.retrieve_secret();

      const quote = await getQuote({
        client: nillionClient,
        operation,
      });

      setQuote({
        quote,
        quoteJson: quote.toJSON(),
        operation,
      });
    }
  };

  const handlePayAndRetrieve = async () => {
    if (nillionClient && quote?.operation) {
      const [nilChainClient, nilChainWallet] =
        await createNilChainClientAndWalletFromPrivateKey();

      const paymentReceipt = await payWithWalletFromPrivateKey(
        nilChainClient,
        nilChainWallet,
        quote
      );

      setPaymentReceipt(paymentReceipt);
      const value = await retrieveSecret({
        nillionClient,
        store_id: storeId,
        secret_name: secretName,
        receipt: paymentReceipt,
      });
      setRetrievedValue(value.toString());
    }
  };

  return (
    <Box component="form" onSubmit={handleGetQuoteSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Store ID"
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
        required
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        label="Secret Name"
        value={secretName}
        onChange={(e) => setSecretName(e.target.value)}
        required
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Get quote
      </Button>
      {quote && (
        <Box mt={2}>
          <p>Quote for retrieval</p>
          <List>
            <ListItem>
              <ListItemText primary={`expires_at: ${quote.quote.expires_at}`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`quote cost base_fee: ${quote.quote.cost.base_fee}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`quote cost congestion_fee: ${quote.quote.cost.congestion_fee}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`quote cost total: ${quote.quote.cost.total}`}
              />
            </ListItem>
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayAndRetrieve}
          >
            Pay and retrieve secret
          </Button>
          {retrievedValue && (
            <List>
              <ListItem>
                <ListItemText primary={`Retrieved value: ${retrievedValue}`} />
              </ListItem>
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RetrieveSecret;
