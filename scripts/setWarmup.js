require('colors');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { ethers } = require("hardhat");

async function main() {
    const network = process.env.HARDHAT_NETWORK || 'development';
    console.log(`Deploying on network`, network) 

    const contractsFilePath = join(process.cwd(), `contracts.${network}.json`);
    const contractsFile = readFileSync(contractsFilePath);
    const contracts = JSON.parse(contractsFile || '{}');

    const [deployer] = await ethers.getSigners();
    console.log('Setting Staking Warmup with the account authority:'.green.bold, deployer.address);

    const Staking = await ethers.getContractFactory('OlympusStaking');
    const staking = await Staking.attach(contracts.staking);

    try {
        await staking.setWarmupLength(0);
        console.log('Succesfully set warmup period to 0'.green.bold);
    } catch (error) {
        console.log('Error setting warmup period'.red.bold);
        console.error(error);
        process.exit();
    }
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })