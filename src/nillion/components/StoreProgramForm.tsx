import React, { useState } from 'react';
import * as nillion from '@nillion/client';
import { getQuote } from '../helpers/getQuote';
import {
  createNilChainClientAndWalletFromPrivateKey,
  payWithWalletFromPrivateKey,
} from '../helpers/nillion';
import { storeProgram } from '../helpers/storeProgram';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { List, ListItem, ListItemText } from '@mui/material';

interface StoreProgramProps {
  nillionClient: nillion.NillionClient;
  defaultProgram?: string;
  onNewStoredProgram?: (data: any) => void;
}

const StoreProgram: React.FC<StoreProgramProps> = ({
  nillionClient,
  defaultProgram = '',
  onNewStoredProgram,
}: StoreProgramProps) => {
  const [quote, setQuote] = useState<any | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<any | null>(null);
  const [selectedProgram, setSelectedProgram] =
    useState<string>(defaultProgram);
  const [programId, setProgramId] = useState<string | null>(null);

  // programs need to have .nada.bin files in public/programs/*
  const selectProgram = [
    { name: 'addition_simple.nada.bin', value: 'addition_simple' },
    { name: 'subtraction_simple.nada.bin', value: 'subtraction_simple' },
  ];

  const handleGetQuoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nillionClient && selectedProgram) {
      const operation = nillion.Operation.store_program();

      const quote = await getQuote({
        client: nillionClient,
        operation,
      });

      console.log(quote);

      setQuote({
        quote,
        quoteJson: quote.toJSON(),
        operation,
      });
    }
  };

  const handlePayAndRetrieve = async () => {
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
      console.log(paymentReceipt);
      const program_id = await storeProgram({
        nillionClient,
        receipt: paymentReceipt,
        programName: selectedProgram,
      });

      setProgramId(program_id);
      if (onNewStoredProgram) {
        onNewStoredProgram({ program_id });
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleGetQuoteSubmit} sx={{ mt: 2 }}>
      <p>
        Select a program to store. Get a quote, then pay to store the program.
      </p>
      <br />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="programSelectLabel">Select Program</InputLabel>
        <Select
          labelId="programSelectLabel"
          id="programSelect"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          required
          label="Select Program"
        >
          <MenuItem value="" disabled>
            Select a program
          </MenuItem>
          {selectProgram.map((program) => (
            <MenuItem key={program.value} value={program.value}>
              {program.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Get quote
      </Button>
      {quote && (
        <Box mt={2}>
          <p>Quote for storing program</p>
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
            Pay and store program
          </Button>
          {programId && (
            <List>
              <ListItem>
                <ListItemText primary={`program id: ${programId}`} />
              </ListItem>
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StoreProgram;
