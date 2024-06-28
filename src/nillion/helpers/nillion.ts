import { DirectSecp256k1Wallet, Registry } from '@cosmjs/proto-signing';
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate';
import { PaymentReceipt } from '@nillion/client-web';
import { MsgPayFor, typeUrl } from '@nillion/client-web/proto';
import { getKeplr, signerViaKeplr } from './keplr';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { ChainInfo, OfflineAminoSigner } from '@keplr-wallet/types';

export interface NillionEnvConfig {
  clusterId: string;
  bootnodes: string[];
  chain: {
    chainId: string;
    endpoint: string;
    keys: string[];
    chainInfo: ChainInfo;
  };
}

export const config: NillionEnvConfig = {
  clusterId: process.env.REACT_APP_NILLION_CLUSTER_ID || '',
  bootnodes: [process.env.REACT_APP_NILLION_BOOTNODE_WEBSOCKET || ''],
  chain: {
    chainId: process.env.REACT_APP_NILLION_NILCHAIN_CHAIN_ID || '',
    endpoint: process.env.REACT_APP_NILLION_NILCHAIN_JSON_RPC || '',
    keys: [process.env.REACT_APP_NILLION_NILCHAIN_PRIVATE_KEY || ''],
    chainInfo: {
      rpc: 'http://127.0.0.1:48102',
      rest: 'http://localhost:26650',
      chainId: process.env.REACT_APP_NILLION_NILCHAIN_CHAIN_ID || '',
      chainName: process.env.REACT_APP_NILLION_NILCHAIN_CHAIN_ID || '',
      chainSymbolImageUrl:
        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
      stakeCurrency: {
        coinDenom: 'NIL',
        coinMinimalDenom: 'unil',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
      },
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: 'nillion',
        bech32PrefixAccPub: 'nillionpub',
        bech32PrefixValAddr: 'nillionvaloper',
        bech32PrefixValPub: 'nillionvaloperpub',
        bech32PrefixConsAddr: 'nillionvalcons',
        bech32PrefixConsPub: 'nillionvalconspub',
      },
      currencies: [
        {
          coinDenom: 'NIL',
          coinMinimalDenom: 'unil',
          coinDecimals: 6,
          coinImageUrl:
            'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
        },
      ],
      feeCurrencies: [
        {
          coinDenom: 'NIL',
          coinMinimalDenom: 'unil',
          coinDecimals: 6,
          coinImageUrl:
            'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
          gasPriceStep: {
            low: 0.001,
            average: 0.001,
            high: 0.01,
          },
        },
      ],
      features: [],
    },
  },
};

export async function createNilChainClientAndWalletFromPrivateKey(): Promise<
  [SigningStargateClient, any]
> {
  const keplr = await getKeplr();
  if (!keplr) {
    throw new Error('Keplr extension not installed');
  }
  const wallet = await signerViaKeplr(config.chain.chainId, keplr);
  console.log(wallet);

  const registry = new Registry();
  registry.register(typeUrl, MsgPayFor);

  const options = {
    registry,
    gasPrice: GasPrice.fromString('0unil'),
  };

  const client = await SigningStargateClient.connectWithSigner(
    config.chain.endpoint,
    wallet,
    options
  );
  return [client, wallet];
}

export async function payWithWalletFromPrivateKey(
  nilChainClient: SigningStargateClient,
  wallet: any,
  quoteInfo: any
): Promise<PaymentReceipt> {
  const { quote } = quoteInfo;
  const denom = 'unil';
  const [account] = await wallet.getAccounts();
  console.log(account);
  const from = account.address;

  const payload: MsgPayFor = {
    fromAddress: from,
    resource: quote.nonce,
    amount: [{ denom, amount: quote.cost.total }],
  };

  const result = await nilChainClient.signAndBroadcast(
    from,
    [{ typeUrl, value: payload }],
    'auto'
  );

  return new PaymentReceipt(quote, result.transactionHash);
}
