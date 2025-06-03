type Props = {
    deposit: () => void;
    withdraw: () => void;
    refreshBalances: () => void;
};

export default function ActionButtons({ deposit, withdraw, refreshBalances }: Props) {
    return (
        <div className="space-x-3 mt-4">
            <button onClick={deposit} className="btn">Déposer 0,01 ETH</button>
            <button onClick={withdraw} className="btn">Retirer</button>
            <button onClick={refreshBalances} className="btn">Rafraîchir</button>
        </div>
    );
}
