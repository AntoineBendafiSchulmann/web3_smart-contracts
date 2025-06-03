import { useState } from "react";
import { ethers } from "ethers";
import { useProvider } from "../providers/ProviderContext";
import { CHAINS } from "../constants";
import LockArtifact from "../abis/Lock.json";

const lockAddress = import.meta.env.VITE_LOCK_ADDRESS as string;
const lockAbi     = (LockArtifact as { abi: any }).abi;

export function useSafe() {
    const { provider, chainId, account } = useProvider();
    const [walletBal,setWalletBal] = useState("…");
    const [lockBal,  setLockBal]   = useState("…");

    const refreshBalances = async () => {
        if (!provider || !account) return;
        const [w,l] = await Promise.all([
        provider.getBalance(account),
        provider.getBalance(lockAddress),
        ]);
        setWalletBal(ethers.formatEther(w));
        setLockBal  (ethers.formatEther(l));
    };

    const connectHardhat = async () => {
        if (!provider) return;
        if (chainId !== CHAINS.HARDHAT.id)
        return alert(`Sélectionne ${CHAINS.HARDHAT.name} (${CHAINS.HARDHAT.id})`);
        await refreshBalances();
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
        try { await lock.withdraw(); await refreshBalances(); }
        catch (e:any) { alert(e?.reason ?? "Retrait refusé"); }
    };

    return { provider, account, walletBal, lockBal, connect: connectHardhat,
            deposit, withdraw, refreshBalances };
}
