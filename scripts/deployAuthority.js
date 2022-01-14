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

    const _governor = deployer.address;
    const _guardian = deployer.address;
    const _policy = deployer.address;
    const _vault = deployer.address;

    try {
        const Authority = await ethers.getContractFactory('OlympusAuthority');
        authority = await Authority.deploy(_governor, _guardian, _policy, _vault);
        console.log('Successfully deployed Authority contract'.green, authority.address);
        contracts.Authority = authority.address;
    } catch (error) {
        console.log('Error deploying Authority contract'.red.bold);
        console.error(error);
        process.exit();
    }

    writeFileSync(contractsFilePath, JSON.stringify(contracts, null, 2));
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })