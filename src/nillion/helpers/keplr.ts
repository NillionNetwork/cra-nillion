import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types';
import { config } from './nillion';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export async function getKeplr(): Promise<Keplr | undefined> {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        resolve(window.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
}

export async function signerViaKeplr(chainId: string, keplr: Keplr) {
  return await keplr
    .experimentalSuggestChain(config.chain.chainInfo)
    .then(async () => {
      await keplr.enable(config.chain.chainId);
      const signer = await keplr.getOfflineSigner(config.chain.chainId);
      return signer;
    });
}
