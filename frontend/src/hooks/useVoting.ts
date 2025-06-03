import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { CHAINS } from "../constants";
import VotingArtifact from "../abis/Voting.json";

const votingAddress = import.meta.env.VITE_VOTING_ADDRESS as string;
const votingAbi     = (VotingArtifact as { abi: any }).abi;

export type Ballot = {
  id: number;
  title: string;
  open: boolean;
  total: number;
  options: string[];
  hasVoted: boolean;
};

export function useVoting(
  provider?: ethers.BrowserProvider,
  account? : string,
  chainId? : number
) {
  const [ballots, setBallots] = useState<Ballot[]>([]);

  const loadBallots = useCallback(async () => {
    if (!provider) return;
    if (chainId !== CHAINS.SEPOLIA.id)
      return alert(`Réseau requis : ${CHAINS.SEPOLIA.name}`);

    const voting = new ethers.Contract(votingAddress, votingAbi, provider);
    const nextId = Number(await voting.nextBallotId());

    const arr: Ballot[] = [];
    for (let id = 0; id < nextId; ++id) {
      const [title, open, , , total] = await voting.ballotState(id);
      const options = await voting.getOptions(id);

      let voted = false;
      if (account) {
        const [, hasVoted] = await voting.status(id, account);
        voted = hasVoted;
      }

      arr.push({ id, title, open, total: Number(total), options, hasVoted: voted });
    }
    setBallots(arr);
  }, [provider, account, chainId]);

  const vote = async (id: number, opt: number) => {
    if (!provider) return;
    if (chainId !== CHAINS.SEPOLIA.id) return;
    const signer = await provider.getSigner();
    await new ethers.Contract(votingAddress, votingAbi, signer).vote(id, opt);
    await loadBallots()
  };

  return { ballots, loadBallots, vote };
}
