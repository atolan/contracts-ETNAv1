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
        const DAI = await ethers.getContractFactory('MockDAI');
        dai = await DAI.deploy();
        console.log('Successfully deployed DAI contract'.green, dai.address);
        contracts.MockDAI = dai.address;
    } catch (error) {
        console.log('Error deploying DAI contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const USDC = await ethers.getContractFactory('MockUSDC');
        usdc = await USDC.deploy();
        console.log('Successfully deployed USDC contract'.green, usdc.address);
        contracts.MockUSDC = usdc.address;
    } catch (error) {
        console.log('Error deploying USDC contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const USDT = await ethers.getContractFactory('MockUSDT');
        usdt = await USDT.deploy();
        console.log('Successfully deployed USDT contract'.green, usdt.address);
        contracts.MockUSDT = usdt.address;
    } catch (error) {
        console.log('Error deploying USDT contract'.red.bold);
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