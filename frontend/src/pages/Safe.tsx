import { useEffect } from "react";
import { useSafe } from "../hooks/useSafe";
import WalletInfo from "../components/WalletInfo";
import ActionButtons from "../components/ActionButtons";

export default function Safe() {
    const {
        account,
        provider,
        walletBal,
        lockBal,
        connect,
        deposit,
        withdraw,
        refreshBalances,
    } = useSafe();

    useEffect(() => {
        if (!provider || !account) return;

        const listener = () => {
            refreshBalances();
        };

        provider.on("block", listener);
        return () => {
            provider.off("block", listener);
        };
    }, [provider, account, refreshBalances]);

    return (
        <main className="card">
            {account ? (
                <>
                    <WalletInfo walletBal={walletBal} lockBal={lockBal} />
                    <ActionButtons
                        deposit={deposit}
                        withdraw={withdraw}
                        refreshBalances={refreshBalances}
                    />
                </>
            ) : (
                <button onClick={connect} className="btn">
                    Connecter MetaMask
                </button>
            )}
        </main>
    );
}
