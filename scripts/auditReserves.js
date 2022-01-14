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
    console.log('Creating DAI Reserves with the account authority:'.green.bold, deployer.address);

    const Treasury = await ethers.getContractFactory('OlympusTreasury');
    const treasury = await Treasury.attach(contracts.Treasury);

    try {
        await treasury.auditReserves();
        console.log('Succesfully audited Treasury Reserves'.green.bold);
    } catch (error) {
        console.log('Error auditing treasury reserves'.red.bold);
        console.error(error);
        process.exit();
    }
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })