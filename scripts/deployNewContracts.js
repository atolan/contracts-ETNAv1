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
    console.log('Deploying contracts with the account authority:'.green.bold, deployer.address);

    const epoch = "1";
    const firstEpochNumber = "1";
    const firstBlockNumber = "1";
    const authority = contracts.Authority;

    let ohm, olympusTreasury, sOHM, gOHM, staking, distributor;

    try {
        const OHM = await ethers.getContractFactory('OlympusERC20Token');
        ohm = await OHM.deploy(authority);
        console.log('Successfully deployed OHM contract'.green, ohm.address);
        contracts.OHM = ohm.address;
    } catch (error) {
        console.log('Error deploying OHM contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const OlympusTreasury = await ethers.getContractFactory('OlympusTreasury');
        olympusTreasury = await OlympusTreasury.deploy(ohm.address, '0', authority);
        console.log('Successfully deployed Treasury contract'.green, olympusTreasury.address);
        contracts.Treasury = olympusTreasury.address;
    } catch (error) {
        console.log('Error deploying Treasury contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const SOHM = await ethers.getContractFactory('sOlympus');
        sOHM = await SOHM.deploy();
        console.log('Successfully deployed Staking Token contract'.green, sOHM.address);
        contracts.SOHM = sOHM.address;
    } catch (error) {
        console.log('Error deploying Staking Token contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const GOHM = await ethers.getContractFactory('gOHM');
        gOHM = await GOHM.deploy(authority, sOHM.address);
        console.log('Successfully deployed Governance Token contract'.green, gOHM.address);
        contracts.GOHM = gOHM.address;
    } catch (error) {
        console.log('Error deploying Governance Token contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const OlympusStaking = await ethers.getContractFactory('OlympusStaking');
        staking = await OlympusStaking.deploy(ohm.address, sOHM.address, gOHM.address, epoch, firstEpochNumber, firstBlockNumber, authority);
        console.log('Successfully deployed Staking contract'.green, staking.address);
        contracts.Staking = staking.address;
    } catch (error) {
        console.log('Error deploying Olympus Staking contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const Distributor = await ethers.getContractFactory('Distributor');
        distributor = await Distributor.deploy(olympusTreasury.address, ohm.address, staking.address, authority);
        console.log('Successfully deployed Distributor contract'.green, distributor.address);
        contracts.Distributor = distributor.address;
    } catch (error) {
        console.log('Error deploying Distributor contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        await sOHM.setIndex('7675210820');
        await sOHM.setgOHM(gOHM.address);
        await sOHM.initialize(staking.address, olympusTreasury.address);
        console.log('Successfully configured Staking token contract'.green);
    } catch (error) {
        console.log('Error configuring Staking token contract'.red.bold);
        console.error(error);
        process.exit();
    }

    writeFileSync(join(contractsFilePath), JSON.stringify(contracts, null , 2));
    console.log('Full Deployment was successful'.green.bold);
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })