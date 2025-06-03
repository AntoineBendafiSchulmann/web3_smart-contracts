import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("deployer:", deployer.address);

    const Voting = await ethers.getContractFactory("SimpleVoting");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    const addr = await voting.getAddress();
    console.log("simpleVoting deployed to:", addr);
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});