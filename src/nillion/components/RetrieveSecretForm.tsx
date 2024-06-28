import React, { useState } from 'react';
import * as nillion from '@nillion/client-web';
import { getQuote } from '../helpers/getQuote';
import {
  createNilChainClientAndWalletFromPrivateKey,
  payWithWalletFromPrivateKey,
} from '../helpers/nillion';
import { retrieveSecret } from '../helpers/retrieveSecret';
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import PayButton from './PayButton';

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
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const reset = () => {
    setStoreId('');
    setSecretName('');
    setQuote(null);
    setPaymentReceipt(null);
    setRetrievedValue(null);
    setLoadingQuote(false);
    setLoadingPayment(false);
  };

  const handleGetQuoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nillionClient) {
      setLoadingQuote(true);
      const operation = nillion.Operation.retrieve_value();

      const quote = await getQuote({
        client: nillionClient,
        operation,
      });

      setQuote({
        quote,
        quoteJson: quote.toJSON(),
        operation,
      });
      setLoadingQuote(false);
    }
  };

  const handlePayAndRetrieve = async () => {
    if (nillionClient && quote?.operation) {
      setLoadingPayment(true);
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
      setLoadingPayment(false);
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
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Get Quote{' '}
        {loadingQuote && (
          <CircularProgress
            size="14px"
            color="inherit"
            style={{ marginLeft: '10px' }}
          />
        )}
      </Button>
      <Button onClick={reset} sx={{ mt: 2, ml: 2 }}>
        Reset
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

          <PayButton
            buttonText="Pay and retrieve"
            onClick={handlePayAndRetrieve}
            loading={loadingPayment}
            displayList={!!retrievedValue}
            listItems={
              retrievedValue
                ? [
                    {
                      displayText: `Retrieved value: ${retrievedValue}`,
                      copyText: retrievedValue,
                    },
                  ]
                : []
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default RetrieveSecret;
