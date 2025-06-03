
import { ethers } from "hardhat";

async function main() {

  const addr = "0x0A926816AFC359dd108B8B9b041DF3a48F1cBC29";// à modifier avec l'adresse du contrat Voting déployé


  const voting = await ethers.getContractAt("Voting", addr);


  const tx = await voting.openBallot(
    "Choix du goûter",
    ["🍩 Donut", "🥐 Croissant", "🍪 Cookie"],
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