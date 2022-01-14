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
    console.log('Deploying mints with the account authority:'.green.bold, deployer.address);

    const Treasury = await ethers.getContractFactory('OlympusTreasury');
    const treasury = await Treasury.attach(contracts.Treasury);

    const DAI = await ethers.getContractFactory('MockDAI');
    const dai = await DAI.attach(contracts.MockDAI)

    // OHMDEBTOR = 10
    // SOHM = 9
    // REWARDMANAGER = 8
    // RESERVEDEBTOR = 7
    const debtLimit = ethers.BigNumber.from('100000').mul(ethers.BigNumber.from(Math.pow(10, 18).toString()))
    const debt = ethers.BigNumber.from('10000').mul(ethers.BigNumber.from(Math.pow(10, 18).toString()))

    try {
        await treasury.enable(8, contracts.Depository, "0x0000000000000000000000000000000000000000");
        console.log('Succesfully set Reward Manager for Treasury'.green.bold);
    } catch (error) {
        console.log('Error getting Treasury DAI balance'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const balance = await dai.balanceOf(contracts.Treasury);
        console.log(`Treasury balance`.green, balance.toString());

        const totalReserves = await treasury.totalReserves();
        console.log(`Treasury Total Reserves`.green, totalReserves.toString());
    } catch (error) {
        console.log('Error getting Treasury DAI balance'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        await treasury.enable(9, contracts.SOHM, "0x0000000000000000000000000000000000000000");
        console.log('Succesfully set SOHM for Treasury'.green.bold);
    } catch (error) {
        console.log('Error setting Test DAI to Reserve Currency'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        await treasury.enable(7, deployer.address, "0x0000000000000000000000000000000000000000");
        console.log('Succesfully set deployer to reserve debtor'.green.bold);
    } catch (error) {
        console.log('Error setting Test DAI to Reserve Currency'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        await treasury.setDebtLimit(deployer.address, debtLimit);
        console.log('Succesfully set deployer debt limit to 100000'.green.bold);
    } catch (error) {
        console.log('Error setting deployer debt limit'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        await treasury.incurDebt(debt, contracts.MockDAI)
        console.log('Succesfully incurred debt 10000 DAI of debt using MockDAI'.green.bold, deployer.address);
    } catch (error) {
        console.log('Error incurring debt'.red.bold);
        console.error(error);
        process.exit();
    }
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })