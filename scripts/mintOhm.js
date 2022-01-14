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

    try {
        const OHM = await ethers.getContractFactory('OlympusERC20Token');
        const ohm = await OHM.attach(contracts.OHM);
        await ohm.mint(deployer.address, 100000 * Math.pow(10, 9));

        console.log('Succesfully minted 100000 OHM to'.green.bold, deployer.address);
    } catch (error) {
        console.log('Error minting new tokens with the OHM contract'.red.bold);
        console.error(error);
        process.exit();
    }
}

main()
    .then(() => process.exit())
    .catch(error => {
        process.exit(1);
    })