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
    console.log('Setting FE Reward with the account authority:'.green.bold, deployer.address);

    const Teller = await ethers.getContractFactory('BondTeller');
    const teller = await Teller.attach(contracts.Teller);

    try {
        await teller.setFEReward(100);
        console.log('Succesfully FE Reward to 1%'.green.bold);
    } catch (error) {
        console.log('Error setting FE Reward'.red.bold);
        console.error(error);
        process.exit();
    }
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })