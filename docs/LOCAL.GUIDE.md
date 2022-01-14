# ETNA DAO Local Deployment Guide

## Requirements

- Node.js and NVM LTS

- Yarn `npm install -g yarn`

- `Ganache` running either as a GUI or App under `localhost:7545`.

### Overview

Please keep in mind that the source code deployments for ETNA DAO has been drastically optimized compared to the Original Olympus Source. This allows you to simply procedurally deploy each contract and configuration in the correct order by following this guide. Drastically simplifying ease of use of the project. All you need to run these deployments is to ability to run `npx hardhat run` in your environment.

### Getting started

You are going to want to get the base contracts deployed first. You can do this by running `npx hardhat run scripts/{script}`. The following are the required scripts to deploy.

```bash
# Deploy the authority
npx hardhat run scripts/deployAuthority.js

# Deploy the new contracts
npx hardhat run scripts/deployNewContracts.js

# Deploy the test tokens
npx hardhat run scripts/deployMockTokens.js

# Mint initial OHM supply
npx hardhat run scripts/mintOhm.js

# Set Vault Authority
npx hardhat run scripts/updateVault.js

# Deploy the Depository and Teller
npx hardhat run scripts/deployDepository.js

# Create reserves for bonding
npx hardhat run scripts/createReserves.js

# Incur Debt to allow bonding
npx hardhat run scripts/incurDebt.js

# Create new test bonds for Depository
npx hardhat run scripts/deployMockBonds.js
```

### Auditing The Treasury

If you need to audit the treasury reserves. You can just run:

```bash
npx hardhat run scripts/auditReserves.js
```

### Adding a Front End Operator Reward

If you want to test Front End Operator Rewards you can run:


```bash
npx hardhat run scripts/setFER.js
```

### Setting the Warmup Period

To set the warm up period you can run: (default is 0)

```bash
npx hardhat run scripts/setWarmup.js
```