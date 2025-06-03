import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

type Ctx = {
    provider?: ethers.BrowserProvider;
    chainId? : number;
    account? : string;
};

const ProviderCtx = createContext<Ctx>({});

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
    const [ctx, setCtx] = useState<Ctx>({});

    const connect = async () => {
        if (!(window as any).ethereum) return alert("Installe MetaMask");
        const p      = new ethers.BrowserProvider((window as any).ethereum);
        const [addr] = await p.send("eth_requestAccounts", []);
        const chain  = Number(await p.send("eth_chainId", []));
        setCtx({ provider: p, account: addr, chainId: chain });
    };

    return (
        <ProviderCtx.Provider value={ctx}>
            {!ctx.provider && (
                <button className="btn connect-btn" onClick={connect}>
                    Connecter MetaMask
                </button>
            )}
            {children}
        </ProviderCtx.Provider>
    );
}

export const useProvider = () => useContext(ProviderCtx);