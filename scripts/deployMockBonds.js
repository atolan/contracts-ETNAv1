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

    const Depository = await ethers.getContractFactory('OlympusBondDepository');
    const depository = await Depository.attach(contracts.Depository);
    console.log(`Deploying Mock Bonds using Depository`.green, depository.address);

    // Samples Terms new
    const terms = {
        _capacity: ethers.BigNumber.from('10000000').mul(ethers.BigNumber.from(Math.pow(10, 18).toString())),
        _capacityInQuote: true,
        _fixedTerm: true,
        _vesting: 1000, // 250000
        _conclusion: ethers.BigNumber.from( parseInt( (Number(new Date()) / 1000) + (60 * 60) ).toString() ), // Unix Epoch - 1 day expiration
        _decimals: 18,
        _currentPrice: ethers.BigNumber.from('10').mul(ethers.BigNumber.from(Math.pow(10, 9).toString()))
    }

    try {
        const Treasury = await ethers.getContractFactory('OlympusTreasury');
        const treasury = await Treasury.attach(contracts.Treasury);
        const baseSupply = await treasury.baseSupply();
        console.log(`Treasury Base Supply`.green, baseSupply.toString());
    } catch (error) { 
        console.log('Error getting baseSupply()'.red.bold);
        console.error(error);
        process.exit();
    }
    
    try {
        const MockDAI = contracts.MockDAI; // _quoteToken
        await depository.addBond(MockDAI, terms._capacity, terms._capacityInQuote, terms._fixedTerm, terms._vesting, terms._conclusion, terms._decimals, terms._currentPrice);
        console.log(`Successfully created MockDAI Bond`.green.bold);
    } catch (error) {
        console.log('Error creating MockDAI Bond contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const MockUSDC = contracts.MockUSDC; // _quoteToken
        await depository.addBond(MockUSDC, terms._capacity, terms._capacityInQuote, terms._fixedTerm, terms._vesting, terms._conclusion, terms._decimals, terms._currentPrice);
        console.log(`Successfully created MockUSDC Bond`.green.bold);
    } catch (error) {
        console.log('Error creating MockUSDC Bond contract'.red.bold);
        console.error(error);
        process.exit();
    }

    try {
        const MockUSDT = contracts.MockUSDT; // _quoteToken
        await depository.addBond(MockUSDT, terms._capacity, terms._capacityInQuote, terms._fixedTerm, terms._vesting, terms._conclusion, terms._decimals, terms._currentPrice);
        console.log(`Successfully created MockUSDT Bond`.green.bold);
    } catch (error) {
        console.log('Error creating MockUSDT Bond contract'.red.bold);
        console.error(error);
        process.exit();
    }

    writeFileSync(contractsFilePath, JSON.stringify(contracts, null, 2));
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })