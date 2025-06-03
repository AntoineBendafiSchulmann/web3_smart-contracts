import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingArtifact from "../abis/Voting.json";
import { CHAINS } from "../constants";

const votingAddress = import.meta.env.VITE_VOTING_ADDRESS as string;
const votingAbi  = (VotingArtifact as { abi: any }).abi;

export default function Results() {
  const [scores, setScores] = useState<{label:string; count:number}[]>([]);

    useEffect(() => {
    (async () => {
      const prov   = new ethers.BrowserProvider((window as any).ethereum);
      const chain  = Number(await prov.send("eth_chainId", []));
      if (chain !== CHAINS.SEPOLIA.id) return;

      const voting = new ethers.Contract(votingAddress, votingAbi, prov);
      const id     = (await voting.nextBallotId()) - 1n;
      const opts   = await voting.getOptions(id);

      const arr = await Promise.all(
        opts.map(async (_:string, i:number) => ({
          label : opts[i],
          count : Number(await voting.tally(id, i))
        }))
      );
      setScores(arr);
    })();
  }, []);

  return (
    <main className="card">
      <h1>Résultats</h1>
      {scores.length===0
        ? <p>Aucun vote compté.</p>
        : scores.map(s=>(
            <p key={s.label}>{s.label} : {s.count}</p>
          ))}
    </main>
  );
}