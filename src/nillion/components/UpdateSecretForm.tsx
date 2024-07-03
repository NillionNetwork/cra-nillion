import React, { useState } from 'react';
import * as nillion from '@nillion/client-web';
import { NillionClient } from '@nillion/client-web';
import { updateSecret } from '../helpers/updateSecret';
import { getQuote } from '../helpers/getQuote';
import {
  createNilChainClientAndWalletFromPrivateKey,
  payWithWalletFromPrivateKey,
} from '../helpers/nillion';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import PayButton from './PayButton';

type SecretDataType = 'SecretBlob' | 'SecretInteger';

interface UpdateSecretFormProps {
  onNewStoredSecret: (data: any) => void;
  secretName: string;
  nillionClient: NillionClient | null;
  isDisabled?: boolean;
  customSecretName?: boolean;
  hidePermissions?: boolean;
  itemName?: string;
}

const UpdateSecretForm: React.FC<UpdateSecretFormProps> = ({
  onNewStoredSecret,
  secretName,
  nillionClient,
  isDisabled = false,
  customSecretName = false,
  itemName = 'secret',
}) => {
  const [secretNameFromForm, setSecretNameFromForm] = useState(secretName);
  const [secret, setSecret] = useState('');
  const [secretStoreId, setSecretStoreId] = useState('');
  const [secretType, setSecretType] = useState<SecretDataType>('SecretBlob');
  const [quote, setQuote] = useState<any | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<any | null>(null);
  const [storedSecrets, setStoredSecrets] = useState<any | null>([]);
  const lastStoredSecret = storedSecrets.length
    ? storedSecrets[storedSecrets.length - 1]
    : null;
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const reset = () => {
    setSecretNameFromForm(secretName);
    setSecretStoreId('');
    setSecret('');
    setQuote(null);
    setPaymentReceipt(null);
    setStoredSecrets(null);
    setLoadingQuote(false);
    setLoadingPayment(false);
  };

  const handleGetQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nillionClient) {
      setLoadingQuote(true);
      const secretForQuote = new nillion.NadaValues();

      if (secretType === 'SecretBlob') {
        const byteArraySecret = new TextEncoder().encode(secret);
        // create new SecretBlob with encoded secret
        const newSecretBlob =
          nillion.NadaValue.new_secret_blob(byteArraySecret);
        // insert the SecretBlob into secrets object
        secretForQuote.insert(secretNameFromForm, newSecretBlob);
      } else {
        // create new SecretInteger
        const newSecretInteger = nillion.NadaValue.new_secret_integer(
          secret.toString()
        );

        // insert the SecretInteger into secrets object
        secretForQuote.insert(secretNameFromForm, newSecretInteger);
      }

      const ttl_days = 30;
      const updateOperation = nillion.Operation.update_values(
        secretForQuote,
        ttl_days
      );

      const quote = await getQuote({
        client: nillionClient,
        operation: updateOperation,
      });

      setQuote({
        quote,
        quoteJson: quote.toJSON(),
        secret: secretForQuote,
        rawSecret: { name: secretNameFromForm, value: secret },
        operation: updateOperation,
      });
      setLoadingQuote(false);
    }
  };

  const handlePayAndUpdate = async () => {
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

      const storeId = await updateSecret({
        nillionClient,
        nillionSecrets: quote.secret,
        updateSecretsReceipt: paymentReceipt,
        storeId: secretStoreId,
      });
      const newStoredSecret = {
        userId: nillionClient.user_id,
        storeId,
        secretType,
        name: quote.rawSecret.name,
      };
      setStoredSecrets((current: any) => {
        const updatedStoredSecrets = [...current];
        updatedStoredSecrets.push(newStoredSecret);
        return updatedStoredSecrets;
      });
      onNewStoredSecret(newStoredSecret);
      setLoadingPayment(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleGetQuoteSubmit} sx={{ mt: 2 }}>
      {!customSecretName && <h2>Store secret: {secretName}</h2>}

      <TextField
        label="Store ID to update"
        value={secretStoreId}
        onChange={(e) => setSecretStoreId(e.target.value)}
        required
        disabled={isDisabled}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      {customSecretName && (
        <TextField
          label={`Set ${itemName} name`}
          value={secretNameFromForm}
          onChange={(e) => setSecretNameFromForm(e.target.value)}
          required
          disabled={isDisabled}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      )}

      <FormControl fullWidth sx={{ my: 1 }}>
        <InputLabel id="secretTypeLabel">Select Secret Type</InputLabel>
        <Select
          labelId="secretTypeLabel"
          id="secretType"
          value={secretType}
          onChange={(e) => setSecretType(e.target.value as SecretDataType)}
          disabled={isDisabled}
          label="Select Secret Type"
        >
          <MenuItem value="SecretBlob">SecretBlob</MenuItem>
          <MenuItem value="SecretInteger">SecretInteger</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label={`Set ${itemName} value`}
        type={secretType === 'SecretBlob' ? 'text' : 'number'}
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        required
        disabled={isDisabled}
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
          <p>Quote for storage</p>
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
            buttonText="Pay and update secret"
            onClick={handlePayAndUpdate}
            loading={loadingPayment}
            displayList={!!storedSecrets.length && !!lastStoredSecret?.storeId}
            listItems={
              lastStoredSecret
                ? [
                    {
                      displayText: `store id:${lastStoredSecret.storeId}`,
                      copyText: lastStoredSecret.storeId,
                    },
                    {
                      displayText: `secret name: ${lastStoredSecret.name}`,
                      copyText: lastStoredSecret.name,
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

export default UpdateSecretForm;
