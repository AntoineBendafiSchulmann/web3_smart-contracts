import { ethers } from "hardhat";

function fmt(b: bigint) {
    return `${ethers.formatEther(b)} ETH`;
    }

    async function showBalances(tag: string, deployer: any, antoine: any, lockAddr: string) {
    const provider = ethers.provider;
    console.log(`\n ${tag}`);
    console.log("  – deployer :", fmt(await provider.getBalance(deployer)));
    console.log("  – antoine  :", fmt(await provider.getBalance(antoine)));
    console.log("  – coffre   :", fmt(await provider.getBalance(lockAddr)));
    }

    async function main() {
    const SAFE_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const LOCK_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const [deployer, antoine] = await ethers.getSigners();
    const safe = await ethers.getContractAt("Safe", SAFE_ADDRESS);
    const lock = await ethers.getContractAt("Lock", LOCK_ADDRESS);

    await showBalances("ÉTAT INITIAL", deployer, antoine, LOCK_ADDRESS);


    await safe.changeOwner(antoine.address);

    await antoine.sendTransaction({
        to: LOCK_ADDRESS,
        value: ethers.parseEther("0.01"),
    });


    await showBalances("APRÈS DÉPÔT (coffre plein)", deployer, antoine, LOCK_ADDRESS);


    const unlockTime = await lock.unlockTime();
    const now        = BigInt(Math.floor(Date.now() / 1000));

    if (now < unlockTime) {
    await ethers.provider.send("evm_increaseTime", [Number(unlockTime - now)]);
    await ethers.provider.send("evm_mine", []);
    }

    await lock.withdraw();

    await showBalances("APRÈS RETRAIT", deployer, antoine, LOCK_ADDRESS);
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
