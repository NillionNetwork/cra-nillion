import React, { useState } from 'react';
import * as nillion from '@nillion/client-web';
import { getQuote } from '../helpers/getQuote';
import { PaymentResult, payWithKeplrWallet } from '../helpers/nillion';
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
import { SigningStargateClient } from '@cosmjs/stargate';

interface RetrieveSecretProps {
  nillionClient: nillion.NillionClient | null;
  nilchainClient: any | null;
  nillionWallet: SigningStargateClient | null;
}

const RetrieveSecret: React.FC<RetrieveSecretProps> = ({
  nillionClient,
  nilchainClient,
  nillionWallet,
}: RetrieveSecretProps) => {
  const [storeId, setStoreId] = useState('');
  const [secretName, setSecretName] = useState('');
  const [quote, setQuote] = useState<any | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [retrieveSecretError, setRetrieveSecretError] = useState<any | null>(
    null
  );
  const [retrievedValue, setRetrievedValue] = useState<string | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const reset = () => {
    setStoreId('');
    setSecretName('');
    setQuote(null);
    setRetrievedValue(null);
    setLoadingQuote(false);
    setLoadingPayment(false);
    setRetrieveSecretError(null);
    setLastTx(null);
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
    if (nillionClient && nilchainClient && nillionWallet && quote?.operation) {
      setLoadingPayment(true);
      const paymentReceipt: PaymentResult = await payWithKeplrWallet(
        nilchainClient,
        nillionWallet,
        quote,
        `retrieve secret: ${secretName}`
      );

      const { receipt, error, tx } = paymentReceipt;
      if (receipt && tx) {
        const value = await retrieveSecret({
          nillionClient,
          store_id: storeId,
          secret_name: secretName,
          receipt,
        });
        setRetrievedValue(value.toString());
        setLastTx(tx);
        setRetrieveSecretError(error);
        setLoadingPayment(false);
      }
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
                    {
                      displayText: `Transaction hash: ${lastTx}`,
                      copyText: lastTx,
                    },
                  ]
                : []
            }
            errorMessage={retrieveSecretError?.toString()}
            tx={lastTx}
          />
        </Box>
      )}
    </Box>
  );
};

export default RetrieveSecret;
