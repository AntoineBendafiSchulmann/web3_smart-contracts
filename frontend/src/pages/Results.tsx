import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingArtifact from "../abis/Voting.json";
import { CHAINS } from "../constants";

const votingAddress = import.meta.env.VITE_VOTING_ADDRESS as string;
const votingAbi = (VotingArtifact as { abi: any }).abi;

type Score  = { label: string; count: number };
type Ballot = { id: number; scores: Score[]; tie: boolean };

export default function Results() {
  const [ballots,setBallots] = useState<Ballot[]>([]);
  const [resettingId,setResettingId] = useState<number | null>(null);
  const [resetStatus,setResetStatus] = useState("");

  const loadResults = async () => {
    const prov  = new ethers.BrowserProvider((window as any).ethereum);
    const chain = Number(await prov.send("eth_chainId", []));
    if (chain !== CHAINS.SEPOLIA.id) return;

    const voting = new ethers.Contract(votingAddress, votingAbi, prov);
    const nextId = Number(await voting.nextBallotId());
    const arr: Ballot[] = [];

    for (let id = 0; id < nextId; id++) {
      const options: string[] = await voting.getOptions(id);
      const scores = await Promise.all(
        options.map(async (_ , i) => ({
          label: options[i],
          count: Number(await voting.tally(id, i))
        }))
      );
      const best = Math.max(...scores.map(s => s.count));
      const tie  = best > 0 && scores.filter(s => s.count === best).length > 1;
      arr.push({ id, scores, tie });
    }
    setBallots(arr);
  };

  useEffect(() => { loadResults(); }, []);

  const resetVote = async (id: number) => {
    try {
      setResettingId(id);
      setResetStatus("Réinitialisation…");
      const prov   = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await prov.getSigner();
      await new ethers.Contract(votingAddress, votingAbi, signer).resetIfTie(id);
      setResetStatus("Vote réinitialisé ✓");
      await loadResults();
    } catch (e: any) {
      setResetStatus(`Erreur : ${e?.reason ?? e?.message ?? "inconnue"}`);
    } finally {
      setResettingId(null);
    }
  };

  return (
    <>
      {ballots.length === 0 ? (
        <main className="card">
          <h1>Résultats</h1>
          <p>Aucun scrutin trouvé.</p>
        </main>
      ) : (
        ballots.map(b => (// map c'est comme un foreach pour aller chercher les scrutins et une card par scrutin
          <main key={b.id} className="card" style={{ marginTop: "1.6rem" }}>
            <h2>Scrutin&nbsp;#{b.id}</h2>
            {b.scores.map(s => (
              <p key={s.label}>{s.label} : {s.count}</p>
            ))}
            {b.tie && (
              <div style={{ marginTop: ".8rem" }}>
                <p style={{ color: "#eab308" }}>Égalité détectée.</p>
                <button
                  className="btn"
                  onClick={() => resetVote(b.id)}
                  disabled={resettingId !== null}
                >
                  {resettingId === b.id ? "Réinitialisation…" : "Réinitialiser le vote"}
                </button>
                {resettingId === b.id && resetStatus && <p>{resetStatus}</p>}
              </div>
            )}
          </main>
        ))
      )}
    </>
  );
}