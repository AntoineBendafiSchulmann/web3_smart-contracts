import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

type Ctx = {
  provider?: ethers.BrowserProvider;
  chainId?: number;
  account?: string;
  connect: () => Promise<void>;
};

const ProviderCtx = createContext<Ctx>({ connect: async () => {} });

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
  const [ctx, setCtx] = useState<Ctx>({ connect: async () => {} });

  const connect = async () => {
    if (!(window as any).ethereum) return alert('Installe MetaMask');
    const p = new ethers.BrowserProvider((window as any).ethereum);
    const [addr] = await p.send('eth_requestAccounts', []);
    const chain = Number(await p.send('eth_chainId', []));
    setCtx({ provider: p, account: addr, chainId: chain, connect });
  };

  // Initialiser ctx avec la fonction connect
  useState(() => {
    setCtx({ connect });
  });

  return <ProviderCtx.Provider value={ctx}>{children}</ProviderCtx.Provider>;
}

export const useProvider = () => useContext(ProviderCtx);
