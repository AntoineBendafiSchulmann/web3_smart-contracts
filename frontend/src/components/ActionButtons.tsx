type Props = {
    deposit: () => void;
    withdraw: () => void;
    refreshBalances: () => void;
};

export default function ActionButtons({ deposit, withdraw, refreshBalances }: Props) {
    return (
        <div>
            <button className="btn" onClick={deposit}>Déposer 0,01 ETH</button>
            <button className="btn" onClick={withdraw}>Retirer</button>
            <button className="btn" onClick={refreshBalances}>Rafraîchir</button>
        </div>
    );
}
