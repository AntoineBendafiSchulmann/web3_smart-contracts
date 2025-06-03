import { useState, useEffect } from "react";
import { ethers } from "ethers";
import LockArtifact from "../abis/Lock.json";

const lockAddress = import.meta.env.VITE_LOCK_ADDRESS as string;
const lockAbi = (LockArtifact as { abi: any }).abi;
const HARDHAT_CHAIN = "0x7a69";

declare global {
  interface EthereumProvider {
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  }
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export default function App() {
  const [account, setAccount]     = useState<string>();
  const [walletBal, setWalletBal] = useState("…");
  const [lockBal,   setLockBal]   = useState("…");
  const [provider,  setProvider]  = useState<ethers.BrowserProvider>();

  /* helpers */
  const initProvider = async () => {
    if (!window.ethereum) { alert("Installe MetaMask"); return; }
    const prov = new ethers.BrowserProvider(window.ethereum as any);
    setProvider(prov);
    return prov;
  };

  const refreshBalances = async (prov = provider) => {
    if (!prov || !account) return;
    const [wBal, lBal] = await Promise.all([
      prov.getBalance(account),
      prov.getBalance(lockAddress),
    ]);
    setWalletBal(ethers.formatEther(wBal));
    setLockBal(ethers.formatEther(lBal));
  };

  /* actions */
  const connect = async () => {
    const prov = await initProvider();
    if (!prov) return;

    const chainId = await prov.send("eth_chainId", []);
    if (chainId !== HARDHAT_CHAIN) {
      alert("Sélectionne le réseau Hardhat (31337) dans MetaMask");
      return;
    }

    const [addr] = await prov.send("eth_requestAccounts", []);
    setAccount(addr);
    await refreshBalances(prov);
  };

  const deposit = async () => {
    if (!provider || !account) return;
    const signer = await provider.getSigner();
    await signer.sendTransaction({ to: lockAddress, value: ethers.parseEther("0.01") });
    await refreshBalances();
  };

  const withdraw = async () => {
    if (!provider) return;
    const signer = await provider.getSigner();
    const lock   = new ethers.Contract(lockAddress, lockAbi, signer);
    try {
      await lock.withdraw();
      await refreshBalances();
    } catch (e: any) {
      alert(e?.reason ?? "Retrait impossible (pas owner ou unlockTime)");
    }
  };

  /* auto-refresh à chaque bloc */
  useEffect(() => {
    if (!provider || !account) return;
    const listener = () => { void refreshBalances(); };
    provider.on("block", listener);
    return () => { provider.off("block", listener); };
  }, [provider, account]);

  /* UI */
  return (
    <section className="card">
      <h1>🛡️ Coffre</h1>

      {account ? (
        <>
          <p><b>Compte :</b> {account.slice(0,6)}…{account.slice(-4)}</p>
          <p><b>Solde wallet :</b> {walletBal} ETH</p>
          <p><b>Solde coffre :</b> {lockBal} ETH</p>

          <button onClick={deposit}>Déposer 0,01 ETH</button>
          <button onClick={withdraw} style={{ marginLeft: 8 }}>Retirer</button>
          <button onClick={() => refreshBalances()} style={{ marginLeft: 8 }}>Rafraîchir</button>
        </>
      ) : (
        <button onClick={connect}>Connecter MetaMask</button>
      )}
    </section>
  );
}