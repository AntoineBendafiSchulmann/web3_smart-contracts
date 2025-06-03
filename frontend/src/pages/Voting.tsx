import { useEffect, useState } from "react";
import { useProvider } from "../providers/ProviderContext";
import { useVoting } from "../hooks/useVoting";

export default function Voting() {
  const { provider, account, chainId } = useProvider();
  const { ballots, loadBallots, register, vote } = useVoting(
    provider,
    account,
    chainId
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadBallots().finally(() => setLoading(false));
  }, [loadBallots]);

  if (!provider) return <p className="card">Connecte MetaMask.</p>;

  return (
    <>
      <main className="card" style={{ marginBottom: "1.6rem" }}>
        <h1>Scrutins en cours</h1>
        {loading && <p>Chargement…</p>}
        {!loading && ballots.length === 0 && <p>Aucun scrutin trouvé.</p>}
      </main>

      <div
        style={{
          display: "grid",
          gap: "1.6rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
        }}
      >
        {ballots.map((b) => (
          <main key={b.id} className="card">
            <h2>
              #{b.id} — {b.title}
            </h2>

            {!b.registered && b.open && (
              <button
                className="btn"
                onClick={() => register(b.id)}
                style={{ margin: "0 0 0.8rem 0" }}
              >
                S’inscrire
              </button>
            )}

            {b.options.map((opt, i) => (
              <div key={i} style={{ margin: ".3rem 0" }}>
                <button
                  className="btn"
                  disabled={!b.open || !b.registered || b.hasVoted}
                  onClick={() => vote(b.id, i)}
                  style={{ marginRight: ".6rem" }}
                >
                  Voter
                </button>
                {opt} {!b.open && `— ${b.total} vote(s)`}
              </div>
            ))}

            {b.hasVoted && (
              <p style={{ color: "#16a34a", marginTop: ".8rem" }}>
                Vous avez déjà voté ✔️
              </p>
            )}
            {!b.open && (
              <p style={{ color: "#dc2626", marginTop: ".8rem" }}>
                Scrutin clôturé
              </p>
            )}
          </main>
        ))}
      </div>
    </>
  );
}