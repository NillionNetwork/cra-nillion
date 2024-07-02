import React, { useState } from 'react';
import * as nillion from '@nillion/client-web';
import { getQuote } from '../helpers/getQuote';
import { PaymentResult, payWithKeplrWallet } from '../helpers/nillion';
import { computeProgram } from '../helpers/compute';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import PayButton from './PayButton';
import { SigningStargateClient } from '@cosmjs/stargate';

interface ComputeParty {
  partyName: string;
  partyId: string;
}

interface ComputeProgramProps {
  nillionClient: nillion.NillionClient | null;
  nilchainClient: any | null;
  nillionWallet: SigningStargateClient | null;
  programId: string;
  additionalComputeValues: nillion.NadaValues;
  storeIds: string[];
  inputParties: ComputeParty[];
  outputParties: ComputeParty[];
  outputName: string;
  onComputeProgram?: (data: any) => void;
}

const ComputeComponent: React.FC<ComputeProgramProps> = ({
  nillionClient,
  nilchainClient,
  nillionWallet,
  programId,
  additionalComputeValues,
  storeIds,
  inputParties,
  outputParties,
  outputName,
  onComputeProgram,
}: ComputeProgramProps) => {
  const [quote, setQuote] = useState<any | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [storedSecretError, setStoredSecretError] = useState<any | null>(null);
  const [computeResult, setComputeResult] = useState<any | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const handleGetQuoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nillionClient) {
      setLoadingQuote(true);
      await nillion.default();

      const operation = nillion.Operation.compute(
        programId,
        additionalComputeValues
      );
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

  const handlePayAndCompute = async () => {
    if (nillionClient && nilchainClient && nillionWallet && quote?.operation) {
      setLoadingPayment(true);
      const paymentReceipt: PaymentResult = await payWithKeplrWallet(
        nilchainClient,
        nillionWallet,
        quote,
        `compute on ${programId} with storeIds: ${storeIds.join(' & ')}`
      );

      const { receipt, error, tx } = paymentReceipt;

      if (receipt && tx) {
        setLastTx(tx);
        const value = await computeProgram({
          nillionClient,
          receipt,
          programId,
          storeIds,
          inputParties,
          outputParties,
          outputName,
          additionalComputeValues,
        });

        setComputeResult(value);

        if (onComputeProgram) {
          onComputeProgram({ value });
        }
      }

      setLoadingPayment(false);
      setStoredSecretError(error);
      setLastTx(null);
    }
  };

  return (
    <Box component="form" onSubmit={handleGetQuoteSubmit} sx={{ mt: 2 }}>
      <p>
        Run a blind computation. Get a quote, then pay to run the computation.
      </p>
      <br />
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
          <PayButton
            buttonText="Pay and compute"
            onClick={handlePayAndCompute}
            loading={loadingPayment}
            displayList={!!computeResult}
            listItems={
              computeResult
                ? [
                    {
                      displayText: `compute result: ${computeResult}`,
                      copyText: computeResult,
                    },
                  ]
                : []
            }
            errorMessage={storedSecretError?.toString()}
            tx={lastTx}
          />
        </Box>
      )}
    </Box>
  );
};

export default ComputeComponent;
