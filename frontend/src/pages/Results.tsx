import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingArtifact from "../abis/Voting.json";
import { CHAINS } from "../constants";

const votingAddress = import.meta.env.VITE_VOTING_ADDRESS as string;
const votingAbi  = (VotingArtifact as { abi: any }).abi;

export default function Results() {
  const [scores, setScores] = useState<{label:string; count:number}[]>([]);
  const [ballotId, setBallotId] = useState<bigint>(0n);
  const [isResetNeeded, setIsResetNeeded] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetStatus, setResetStatus] = useState<string>("");

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const prov = new ethers.BrowserProvider((window as any).ethereum);
      const chain = Number(await prov.send("eth_chainId", []));
      if (chain !== CHAINS.SEPOLIA.id) return;

      const voting = new ethers.Contract(votingAddress, votingAbi, prov);
      const id = (await voting.nextBallotId()) - 1n;
      setBallotId(id);
      const opts = await voting.getOptions(id);

      const arr = await Promise.all(
        opts.map(async (_:string, i:number) => ({
          label: opts[i],
          count: Number(await voting.tally(id, i))
        }))
      );
      setScores(arr);
      
      // Vérifier s'il y a une égalité
      checkForTie(arr);
    } catch (error) {
      console.error("Erreur lors du chargement des résultats:", error);
    }
  };

  const checkForTie = (results: {label:string; count:number}[]) => {
    if (results.length < 2) return;
    
    // Trouver le score maximum
    const maxScore = Math.max(...results.map(s => s.count));
    
    // Si le score maximum est 0, pas besoin de vérifier l'égalité
    if (maxScore === 0) return;
    
    // Compter combien d'options ont le score maximum
    const maxScoreCount = results.filter(s => s.count === maxScore).length;
    
    // S'il y a plus d'une option avec le score maximum, c'est une égalité
    setIsResetNeeded(maxScoreCount > 1);
  };

  const resetVote = async () => {
    try {
      setIsResetting(true);
      setResetStatus("Réinitialisation en cours...");
      
      const prov = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await prov.getSigner();
      const voting = new ethers.Contract(votingAddress, votingAbi, signer);
      
      const tx = await voting.resetIfTie(ballotId);
      await tx.wait();
      
      setResetStatus("Vote réinitialisé avec succès!");
      setIsResetNeeded(false);
      
      // Recharger les résultats après réinitialisation
      await loadResults();
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation:", error);
      setResetStatus(`Erreur: ${error.message || "Impossible de réinitialiser le vote"}`);
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
            <div className="tie-warning">
              <p>Égalité détectée ! Vous pouvez réinitialiser le vote.</p>
              <button 
                className="btn" 
                onClick={resetVote} 
                disabled={isResetting}
              >
                {isResetting ? "Réinitialisation..." : "Réinitialiser le vote"}
              </button>
              {resetStatus && <p>{resetStatus}</p>}
            </div>
          )}
        </>
      )}
    </main>
  );
}