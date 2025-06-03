type Props = {
    walletBal: string;
    lockBal: string;
};

export default function WalletInfo({ walletBal, lockBal }: Props) {
    return (
        <>
            <p><b>Solde wallet :</b> {walletBal} ETH</p>
            <p><b>Solde coffre :</b> {lockBal} ETH</p>
        </>
    );
}
