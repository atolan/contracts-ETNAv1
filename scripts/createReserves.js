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

    const DAI = await ethers.getContractFactory('MockDAI');
    const dai = await DAI.attach(contracts.MockDAI);

    const million = ethers.BigNumber.from('1000000').mul(ethers.BigNumber.from(Math.pow(10, 18).toString()));

    try {
        await treasury.enable(0, deployer.address, "0x0000000000000000000000000000000000000000");
        console.log('Succesfully set deloyer as RESERVEDEPOSITOR'.green.bold);
    } catch (error) {
        console.log('Error setting Test DAI to Reserve Currency'.red.bold);
        console.error(error);
        process.exit();
    }    

    try {
        await treasury.enable(2, contracts.MockDAI, "0x0000000000000000000000000000000000000000");
        console.log('Succesfully set Test DAI to Reserve Currency'.green.bold);
    } catch (error) {
        console.log('Error setting Test DAI to Reserve Currency'.red.bold);
        console.error(error);
        process.exit();
    }    

    try {
        await dai.approve(contracts.Treasury, million);
        await treasury.deposit(million, contracts.MockDAI, 0);
        console.log('Successfully sent 1 million DAI to Treasury Contract'.green, dai.address);
    } catch (error) {
        console.log('Error sending 1 million DAI to Reserve Contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const totalReserves = await treasury.totalReserves();
        console.log(`Treasury Total Reserves`.green, totalReserves.toString());
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