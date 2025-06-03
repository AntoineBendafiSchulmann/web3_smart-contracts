import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const addr = process.env.VOTING_ADDRESS;
  if (!addr) throw new Error("VOTING_ADDRESS manquant dans .env");

  const voting = await ethers.getContractAt("Voting", addr);

  const tx = await voting.openBallot(
    "Meilleur langage de programmation",
    ["⚡ Rust", "🟦 TypeScript", "🐍 Python", "🟥 Ruby"],
    10
  );

  console.log("tx envoyée :", tx.hash);
  await tx.wait();
  console.log("Scrutin créé !");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});