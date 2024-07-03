interface Window {
  keplr: Keplr;
}

interface Keplr {
  enable(chainId: string): Promise<void>;
  experimentalSuggestChain(chainInfo: ChainInfo): Promise<void>;
  getOfflineSigner(chainId: string): OfflineSigner;
}

interface ChainInfo {
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  bip44: {
    coinType: number;
  };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: Currency[];
  feeCurrencies: FeeCurrency[];
  stakeCurrency: Currency;
  features: string[];
}

interface Currency {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinImageUrl: string;
}

interface FeeCurrency extends Currency {
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
}

interface OfflineSigner {
  getAccounts(): Promise<AccountData[]>;
}

interface AccountData {
  address: string;
  pubkey: Uint8Array;
  algo: string;
}
