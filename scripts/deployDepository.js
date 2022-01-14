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

    try {
        const Depository = await ethers.getContractFactory('OlympusBondDepository');
        depository = await Depository.deploy(contracts.OHM, contracts.Treasury, contracts.Staking, contracts.GOHM, contracts.Authority);
        console.log('Successfully deployed Depository contract'.green, depository.address);
        contracts.Depository = depository.address;
    } catch (error) {
        console.log('Error deploying Depository contract'.red.bold);
        console.error(error);
        process.exit();
    }

    /*
    @TODO: Create Aurora Compatible Bonding Calculator

    try {
        const StandardBondingCalculator = await ethers.getContractFactory('OlympusBondingCalculator');
        sbc = await StandardBondingCalculator.deploy(contracts.OHM);
        console.log('Successfully deployed StandardBondingCalculator contract'.green, sbc.address);
        contracts.StandardCalculator = sbc.address;
    } catch (error) {
        console.log('Error deploying StandardBondingCalculator contract'.red.bold);
        console.error(error);
        process.exit();
    }
    */

    writeFileSync(contractsFilePath, JSON.stringify(contracts, null, 2));
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })