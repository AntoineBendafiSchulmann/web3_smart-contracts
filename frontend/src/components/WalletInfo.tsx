type Props = {
    walletBal: string;
    lockBal: string;
};

export default function WalletInfo({ walletBal, lockBal }: Props) {
    return (
        <div className="wallet-info">
            <p><strong>Solde wallet :</strong> {walletBal} ETH</p>
            <p><strong>Solde coffre :</strong> {lockBal} ETH</p>
        </div>
    );
}
