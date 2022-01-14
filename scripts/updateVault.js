require('colors');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { ethers } = require("hardhat");

async function main() {
    const network = process.env.HARDHAT_NETWORK || 'development';
    console.log(`Deploying on network`, network); 

    const contractsFilePath = join(process.cwd(), `contracts.${network}.json`);
    const contractsFile = readFileSync(contractsFilePath);
    const contracts = JSON.parse(contractsFile || '{}');

    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account authority:'.green.bold, deployer.address);

    const _vault = contracts.Treasury;

    try {
        const Authority = await ethers.getContractFactory('OlympusAuthority');
        authority = await Authority.attach(contracts.Authority);
        await authority.pushVault(_vault, true);
        console.log('Successfully updated Authority Vault address to Treasury contract'.green.bold);
        contracts.Authority = authority.address;
    } catch (error) {
        console.log('Error updating Authority contract'.red.bold);
        console.error(error);
        process.exit();
    }
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })