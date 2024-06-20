import React, { useState } from 'react';
import * as nillion from '@nillion/client';
import { getQuote } from '../helpers/getQuote';
import {
  createNilChainClientAndWalletFromPrivateKey,
  payWithWalletFromPrivateKey,
} from '../helpers/nillion';
import { computeProgram } from '../helpers/compute';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { List, ListItem, ListItemText } from '@mui/material';

interface ComputeParty {
  partyName: string;
  partyId: string;
}

interface ComputeProgramProps {
  nillionClient: nillion.NillionClient;
  programId: string;
  computeTimeSecrets: nillion.Secrets;
  storeIds: string[];
  inputParties: ComputeParty[];
  outputParties: ComputeParty[];
  outputName: string;
  onComputeProgram?: (data: any) => void;
}

const ComputeComponent: React.FC<ComputeProgramProps> = ({
  nillionClient,
  programId,
  computeTimeSecrets,
  storeIds,
  inputParties,
  outputParties,
  outputName,
  onComputeProgram,
}: ComputeProgramProps) => {
  const [quote, setQuote] = useState<any | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<any | null>(null);
  const [computeResult, setComputeResult] = useState<any | null>(null);

  const handleGetQuoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nillionClient) {
      await nillion.default();

      const operation = nillion.Operation.compute(
        programId,
        computeTimeSecrets
      );
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

  const handlePayAndCompute = async () => {
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

      const value = await computeProgram({
        nillionClient,
        receipt: paymentReceipt,
        programId,
        storeIds,
        inputParties,
        outputParties,
        outputName,
      });

      console.log(value);

      setComputeResult(value);

      if (onComputeProgram) {
        onComputeProgram({ value });
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleGetQuoteSubmit} sx={{ mt: 2 }}>
      <p>
        Run a blind computation. Get a quote, then pay to run the computation.
      </p>
      <br />
      <Button type="submit" variant="contained" color="primary">
        Get quote
      </Button>
      {quote && (
        <Box mt={2}>
          <p>Quote for running blind computation</p>
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
            onClick={handlePayAndCompute}
          >
            Pay and compute
          </Button>
          {computeResult && (
            <List>
              <ListItem>
                <ListItemText primary={`compute result: ${computeResult}`} />
              </ListItem>
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ComputeComponent;
