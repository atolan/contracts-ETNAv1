# ETNA DAO Testnet Scripts

Bash scripts with `--network testnet` suffix provided for ease of use.

```bash
# Deploy the authority
npx hardhat run scripts/deployAuthority.js --network testnet

# Deploy the new contracts
npx hardhat run scripts/deployNewContracts.js --network testnet

# Deploy the test tokens
npx hardhat run scripts/deployMockTokens.js --network testnet

# Mint initial OHM supply
npx hardhat run scripts/mintOhm.js --network testnet

# Set Vault Authority
npx hardhat run scripts/updateVault.js --network testnet

# Deploy the Depository and Teller
npx hardhat run scripts/deployDepository.js --network testnet

# Create new test bonds for Depository
npx hardhat run scripts/deployMockBonds.js --network testnet

# Create reserves for bonding
npx hardhat run scripts/createReserves.js --network testnet

# Set warmup period to 0 (can change later)
npx hardhat run scripts/setWarmup.js --network testnet
```

### Auditing The Treasury

If you need to audit the treasury reserves. You can just run:

```bash
npx hardhat run scripts/auditReserves.js --network testnet
```

### Adding a Front End Operator Reward

If you want to test Front End Operator Rewards you can run:


```bash
npx hardhat run scripts/setFER.js --network testnet
```

### Setting the Warmup Period

To set the warm up period you can run: (default is 0)

```bash
npx hardhat run scripts/setWarmup.js --network testnet
```