import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@vechain/sdk-hardhat-plugin";
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import "dotenv/config"

const accounts = [process.env.PRIVATE_KEY]

const namedAccounts = {
  deployer: { default: 0 },
  proxyOwner: { default: 0 },
  owner: { default: 0 },
};

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  ignition: {
    requiredConfirmations: 1
  },
  networks: {
    vechain_testnet: {
      url: "https://testnet.vechain.org",
      accounts,

      // optionally use fee delegation to let someone else pay the gas fees
      // visit vechain.energy for a public fee delegation service
      delegator: {
        delegatorUrl: "https://sponsor-testnet.vechain.energy/by/90"
      },
      enableDelegation: true,
    },

    vechain_mainnet: {
      url: "https://mainnet.vechain.org",
      accounts
    },
  },
  namedAccounts
};

export default config;
