import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Deploying with account: ${deployer.address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH\n`);

    const Safe = await ethers.getContractFactory("Safe");
    const safe = await Safe.deploy();
    await safe.waitForDeployment();
    const safeAddress = await safe.getAddress();
    console.log(`Safe deployed to: ${safeAddress}\n`);

    const unlockTime = Math.floor(Date.now() / 1000) + 3600; 
    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, {
        value: ethers.parseEther("0.05"),
    });
    await lock.waitForDeployment();
    const lockAddress = await lock.getAddress();
    console.log(`Lock deployed to: ${lockAddress}\n`);

    console.log("Safe:", safeAddress);
    console.log("Lock:", lockAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});