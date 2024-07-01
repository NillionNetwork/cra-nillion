import { DirectSecp256k1Wallet, Registry } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { PaymentReceipt } from "@nillion/client-web";
import { MsgPayFor, typeUrl } from "@nillion/client-web/proto";
import { getKeplr, signerViaKeplr } from "./keplr";

export interface NillionEnvConfig {
  clusterId: string;
  bootnodes: string[];
  chain: {
    endpoint: string;
    keys: string[];
  };
}

export const config: NillionEnvConfig = {
  clusterId: process.env.REACT_APP_NILLION_CLUSTER_ID || "",
  bootnodes: [process.env.REACT_APP_NILLION_BOOTNODE_WEBSOCKET || ""],
  chain: {
    endpoint: process.env.REACT_APP_NILLION_NILCHAIN_JSON_RPC || "",
    keys: [process.env.REACT_APP_NILLION_NILCHAIN_PRIVATE_KEY || ""],
  },
};

function options(registry: Registry): any {
  return {
    registry,
    gasPrice: GasPrice.fromString("25unil"),
    gasAdjustment: 1.3,
    autoGas: true,
  };
}

async function createNilChainClientAndWallet(
  wallet: any,
): Promise<[SigningStargateClient, any]> {
  const registry = new Registry();
  registry.register(typeUrl, MsgPayFor);

  const opts = options(registry);

  const client = await SigningStargateClient.connectWithSigner(
    config.chain.endpoint,
    wallet,
    opts,
  );
  return [client, wallet];
}

export async function createNilChainClientAndWalletFromPrivateKey(): Promise<
  [SigningStargateClient, any]
> {
  const key = Uint8Array.from(
    config.chain.keys[0].match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
  const wallet = await DirectSecp256k1Wallet.fromKey(key, "nillion");
  return createNilChainClientAndWallet(wallet);
}

export async function createNilChainClientAndWalletFromKeplr(): Promise<
  [SigningStargateClient, any]
> {
  const keplr = await getKeplr();
  if (!keplr) {
    throw new Error("Keplr extension not installed");
  }
  const wallet = await signerViaKeplr(config.clusterId, keplr);
  return createNilChainClientAndWallet(wallet);
}

export async function payWithWallet(
  nilChainClient: SigningStargateClient,
  wallet: any,
  quoteInfo: any,
): Promise<PaymentReceipt> {
  const { quote } = quoteInfo;
  const denom = "unil";
  const [account] = await wallet.getAccounts();
  const from = account.address;

  const payload: MsgPayFor = {
    fromAddress: from,
    resource: quote.nonce,
    amount: [{ denom, amount: quote.cost.total }],
  };

  const result = await nilChainClient.signAndBroadcast(
    from,
    [{ typeUrl, value: payload }],
    "auto",
  );

  return new PaymentReceipt(quote, result.transactionHash);
}
