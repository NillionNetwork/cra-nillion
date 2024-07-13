import React, { useState, useEffect } from 'react';
import * as nillion from '@nillion/client-web';
import { getQuote } from '../helpers/getQuote';
import {
  createNilChainClientAndWalletFromPrivateKey,
  payWithWalletFromPrivateKey,
} from '../helpers/nillion';
import { storeProgram } from '../helpers/storeProgram';
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
} from '@mui/material';
import PayButton from './PayButton';
import { transformNadaProgramToUint8Array } from '../helpers/transformNadaProgramToUint8Array';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface StoreProgramProps {
  nillionClient: nillion.NillionClient;
  defaultProgram?: string;
  onNewStoredProgram?: (data: any) => void;
}

SyntaxHighlighter.registerLanguage('python', python);

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
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [programCode, setProgramCode] = useState<string | null>(null);

  const reset = () => {
    setQuote(null);
    setPaymentReceipt(null);
    setSelectedProgram(defaultProgram);
    setProgramId(null);
    setProgramCode(null);
    setLoadingQuote(false);
    setLoadingPayment(false);
  };

  // programs need to have .nada.bin files in public/programs/*
  const selectProgram = defaultProgram
    ? [{ name: `${defaultProgram}.nada.bin`, value: defaultProgram }]
    : [
        { name: 'addition_simple.nada.bin', value: 'addition_simple' },
        { name: 'subtraction_simple.nada.bin', value: 'subtraction_simple' },
      ];

  useEffect(() => {
    const fetchProgramCode = async () => {
      if (selectedProgram) {
        const response = await fetch(`./programs/${selectedProgram}.py`);
        const text = await response.text();
        setProgramCode(text);
      }
    };

    fetchProgramCode();
  }, [selectedProgram]);

  const handleGetQuoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nillionClient && selectedProgram) {
      setLoadingQuote(true);
      const programBinary = await transformNadaProgramToUint8Array(
        `./programs/${selectedProgram}.nada.bin`
      );
      const operation = nillion.Operation.store_program(programBinary);

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

  const handlePayAndStoreProgram = async () => {
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
      const program_id = await storeProgram({
        nillionClient,
        receipt: paymentReceipt,
        programName: selectedProgram,
      });

      setProgramId(program_id);
      if (onNewStoredProgram) {
        onNewStoredProgram({ program_id });
      }
      setLoadingPayment(false);
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

      {programCode && (
        <Box my={2} p={2} bgcolor="#f5f5f5" borderRadius={4}>
          <SyntaxHighlighter language="python" style={docco}>
            {programCode}
          </SyntaxHighlighter>
        </Box>
      )}

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
          <PayButton
            buttonText="Pay and store program"
            onClick={handlePayAndStoreProgram}
            loading={loadingPayment}
            displayList={!!programId}
            listItems={
              programId
                ? [
                    {
                      displayText: `program id: ${programId}`,
                      copyText: programId,
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

export default StoreProgram;
