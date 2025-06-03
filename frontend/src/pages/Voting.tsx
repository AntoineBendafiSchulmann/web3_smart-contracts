import { useEffect, useState } from "react";
import { useProvider } from "../providers/ProviderContext";
import { useVoting }   from "../hooks/useVoting";

export default function Voting() {
    const { provider, account, chainId } = useProvider();
    const { ballots, loadBallots, vote } = useVoting(provider, account, chainId);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        loadBallots().finally(() => setLoading(false));
    }, [loadBallots]);

    if (!provider) return <p className="card">Connecte MetaMask.</p>;

    return (
        <main className="card">
            <h1>Scrutins en cours</h1>
            {loading && <p>Chargement…</p>}
            {!loading && ballots.length === 0 && <p>Aucun scrutin trouvé.</p>}

            {ballots.map(b => (
                <section key={b.id} style={{ marginTop: "1.6rem" }}>
                    <h2>#{b.id} — {b.title}</h2>

                    {b.options.map((opt, i) => (
                        <div key={i} style={{ margin: ".3rem 0" }}>
                            <button
                                className="btn"
                                disabled={!b.open || b.hasVoted}
                                onClick={() => vote(b.id, i)}
                                style={{ marginRight: ".6rem" }}
                            >
                                Voter
                            </button>
                            {opt} {!b.open && `— ${b.total} vote(s)`}
                        </div>
                    ))}

                    {b.hasVoted && <p style={{ color: "#16a34a" }}>Vous avez déjà voté ✔️</p>}
                    {!b.open    && <p style={{ color: "#dc2626" }}>Scrutin clôturé</p>}
                </section>
            ))}
        </main>
    );
}