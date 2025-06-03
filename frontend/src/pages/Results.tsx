import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useProvider } from "../providers/ProviderContext";
import { CHAINS } from "../constants";
import VotingArtifact from "../abis/SimpleVoting.json";

const votingAddress = import.meta.env.VITE_VOTING_ADDRESS as string;
const votingAbi     = (VotingArtifact as { abi: any }).abi;

type Result = {
    id: number;
    title: string;
    totals: number[];
    options: string[];
};

export default function Results() {
    const { provider, chainId } = useProvider();
    const [list, setList] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!provider || chainId !== CHAINS.SEPOLIA.id) return;
        const run = async () => {
            setLoading(true);
            const voting = new ethers.Contract(votingAddress, votingAbi, provider);
            const nextId = Number(await voting.nextBallotId());
            const arr: Result[] = [];
            for (let id = 0; id < nextId; ++id) {
                const [title]  = await voting.ballotState(id);
                const options  = await voting.getOptions(id);
                const totals   = await Promise.all(
                    options.map((_: any, i: number) => voting.tally(id, i))
                );
                arr.push({ id, title, options, totals: totals.map(Number) });
            }
            setList(arr);
            setLoading(false);
        };
        run();
    }, [provider, chainId]);

    if (!provider) return <p className="card">Connecte MetaMask.</p>;

    return (
        <main className="card">
            <h1>Résultats</h1>
            {loading && <p>Chargement…</p>}
            {!loading && list.length === 0 && <p>Aucun scrutin.</p>}

            {list.map(r => (
                <section key={r.id} style={{ marginTop: "1.6rem" }}>
                    <h2>#{r.id} — {r.title}</h2>
                    {r.options.map((opt, i) => (
                        <p key={i}>{opt} : {r.totals[i]} vote(s)</p>
                    ))}
                </section>
            ))}
        </main>
    );
}