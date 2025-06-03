import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingArtifact from "../abis/Voting.json";
import { CHAINS } from "../constants";

const votingAddress = import.meta.env.VITE_VOTING_ADDRESS as string;
const votingAbi = (VotingArtifact as { abi: any }).abi;

type Score = { label: string; count: number };

export default function Results() {
    const [scores, setScores] = useState<Score[]>([]);
    const [ballotId, setBallotId] = useState<bigint>(0n);
    const [isResetNeeded, setIsResetNeeded] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [resetStatus, setResetStatus] = useState("");

    const loadResults = async () => {
    const prov = new ethers.BrowserProvider((window as any).ethereum);
    const chain = Number(await prov.send("eth_chainId", []));
    if (chain !== CHAINS.SEPOLIA.id) return;

    const voting = new ethers.Contract(votingAddress, votingAbi, prov);
    const nextIdBn = await voting.nextBallotId();
    if (nextIdBn === 0n) return;

    const id = nextIdBn - 1n;
    setBallotId(id);

    const options: string[] = await voting.getOptions(id);
    const results = await Promise.all(
      options.map(async (_, i) => ({
        label: options[i],
        count: Number(await voting.tally(id, i))
      }))
    );
    setScores(results);

    const best = Math.max(...results.map(r => r.count));
    setIsResetNeeded(best > 0 && results.filter(r => r.count === best).length > 1);
  };

  useEffect(() => { loadResults(); }, []);

  const resetVote = async () => {
    try {
      setIsResetting(true);
      setResetStatus("Réinitialisation…");
      const prov = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await prov.getSigner();
      await new ethers.Contract(votingAddress, votingAbi, signer).resetIfTie(ballotId);
      setResetStatus("Vote réinitialisé ✓");
      await loadResults();
    } catch (e: any) {
      setResetStatus(`Erreur : ${e?.reason ?? e?.message ?? "inconnue"}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="card">
      <h1>Résultats</h1>

      {scores.length === 0 ? (
        <p>Aucun vote compté.</p>
      ) : (
        <>
          {scores.map(s => (
            <p key={s.label}>{s.label} : {s.count}</p>
          ))}

          {isResetNeeded && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ color: "#eab308" }}>Égalité détectée.</p>
              <button className="btn" onClick={resetVote} disabled={isResetting}>
                {isResetting ? "Réinitialisation…" : "Réinitialiser le vote"}
              </button>
              {resetStatus && <p>{resetStatus}</p>}
            </div>
          )}
        </>
      )}
    </main>
  );
}