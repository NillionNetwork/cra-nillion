// src/chainInfo.ts

export const chainInfo = {
  chainId: 'nillion-chain-testnet-1',
  chainName: 'Nillion Testnet',
  rpc: 'https://testnet-nillion-rpc.lavenderfive.com',
  rest: 'https://testnet-nillion-api.lavenderfive.com',
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
  stakeCurrency: {
    coinDenom: 'NIL',
    coinMinimalDenom: 'unil',
    coinDecimals: 6,
    coinImageUrl:
      'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
  },
  features: [],
};
