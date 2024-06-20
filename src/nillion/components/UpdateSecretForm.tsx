import React, { useState } from 'react';
import * as nillion from '@nillion/client';
import { NillionClient } from '@nillion/client';
import { updateSecret } from '../helpers/updateSecret';
import { getQuote } from '../helpers/getQuote';
import {
  createNilChainClientAndWalletFromPrivateKey,
  payWithWalletFromPrivateKey,
} from '../helpers/nillion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { List, ListItem, ListItemText } from '@mui/material';

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
  const reset = () => {
    setSecretNameFromForm(secretName);
    setSecretStoreId('');
    setSecret('');
    setQuote(null);
  };

  const handleGetQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nillionClient) {
      const secretForQuote = new nillion.Secrets();

      if (secretType === 'SecretBlob') {
        const byteArraySecret = new TextEncoder().encode(secret);
        // create new SecretBlob with encoded secret
        const newSecretBlob = nillion.Secret.new_blob(byteArraySecret);
        // insert the SecretBlob into secrets object
        secretForQuote.insert(secretNameFromForm, newSecretBlob);
      } else {
        // create new SecretInteger
        const newSecretInteger = nillion.Secret.new_integer(secret.toString());

        // insert the SecretInteger into secrets object
        secretForQuote.insert(secretNameFromForm, newSecretInteger);
      }

      const updateOperation = nillion.Operation.update_secrets(secretForQuote);

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
    }
  };

  const handlePayAndUpdate = async () => {
    console.log('paying...');
    if (nillionClient && quote?.operation) {
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
        storeSecretsReceipt: paymentReceipt,
        storeId: secretStoreId,
      });
      console.log('stored!', storeId);
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

      <FormControl fullWidth sx={{ mb: 2 }}>
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
        Get Quote
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
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayAndUpdate}
          >
            Pay and update secret
          </Button>
          {!!storedSecrets.length &&
            storedSecrets[storedSecrets.length - 1].storeId && (
              <List>
                <ListItem>
                  <ListItemText
                    primary={`store id: ${storedSecrets[storedSecrets.length - 1].storeId}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={`secret name: ${storedSecrets[storedSecrets.length - 1].name}`}
                  />
                </ListItem>
              </List>
            )}
        </Box>
      )}
    </Box>
  );
};

export default UpdateSecretForm;
