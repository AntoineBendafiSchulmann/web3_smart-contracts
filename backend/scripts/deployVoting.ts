import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("deployer:", deployer.address);

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    console.log("voting deployed to:", await voting.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });