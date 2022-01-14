import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config({ path: resolve(__dirname, "./.env") });

const config: HardhatUserConfig = {
  defaultNetwork: "development",
  networks: {
    development: {
      url: 'http://localhost:8545'
    },
    testnet: {
      url: "https://testnet.aurora.dev",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    aurora: {
      url: "https://mainnet.aurora.dev",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.0" },
      {
        version: "0.7.5",
        settings: {
          metadata: {
            bytecodeHash: "none",
          },
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
      {
        version: "0.5.16",
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
};

export default config;
