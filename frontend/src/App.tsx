import {useEffect} from "react";
import {useEthereum} from "./hooks/useEthereum";
import Navbar from "./components/Navbar";
import WalletInfo from "./components/WalletInfo";
import ActionButtons from "./components/ActionButtons";

export default function App() {
    const {
        account,
        provider,
        walletBal,
        lockBal,
        connect,
        deposit,
        withdraw,
        refreshBalances,
    } = useEthereum();

    useEffect(() => {
        if (!provider || !account) return;
        const listener = () => void refreshBalances();
        provider.on("block", listener);
        return () => provider.off("block", listener);
    }, [provider, account, refreshBalances]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar account={account}/>
            <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
                {account ? (
                    <>
                        <WalletInfo walletBal={walletBal} lockBal={lockBal}/>
                        <ActionButtons
                            deposit={deposit}
                            withdraw={withdraw}
                            refreshBalances={refreshBalances}
                        />
                    </>
                ) : (
                    <button onClick={connect} className="btn w-full">
                        Connecter MetaMask
                    </button>
                )}
            </main>
        </div>
    );
}
