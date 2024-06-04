# Initialize Project

```shell
npm init -y
npm install --save @vechain/sdk-hardhat-plugin hardhat
```

## Add Helper

```shell
npm install --save dotenv
npm install --save @nomicfoundation/hardhat-ethers ethers hardhat-deploy hardhat-deploy-ethers
npm install --save @openzeppelin/contracts @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades
npm install --save nodemon
```

## Create Random Private Key for Deployer

```shell
echo "PRIVATE_KEY=0x$(openssl rand -hex 32)" > .env                                                          
```

## Create Hardhat Configuration

```shell
npx hardhat init
```

```shell
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.22.5 👷‍

✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · ./hardhat-token-bound-accounts
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox)? (Y/n) · y

npm install --save "@nomicfoundation/hardhat-toolbox@^5.0.0"
npm WARN deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm WARN deprecated glob@7.1.7: Glob versions prior to v9 are no longer supported

added 282 packages, and audited 592 packages in 25s

98 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

✨ Project created ✨

See the README.md file for some example tasks you can run

Give Hardhat a star on Github if you're enjoying it! ⭐️✨

     https://github.com/NomicFoundation/hardhat
```

## Adjust `hardhat.config.ts` with Vechain Connectivity

```ts
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
```

## Deploy with `hardhat-ignition`

```shell
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network vechain_testnet
```

```shell
✔ Confirm deploy to network vechain_testnet (100010)? … yes
Hardhat Ignition 🚀

Resuming existing deployment from ./ignition/deployments/chain-100010

Deploying [ LockModule ]

Batch #1
  Executed LockModule#Lock

[ LockModule ] successfully deployed 🚀

Deployed Addresses

LockModule#Lock - 0x835Fa75aA77dA0400a73A16C47fceB7CB099B4eb
```


## Deploy with `hardhat-deploy`

```shell
npx hardhat deploy --network vechain_testnet
```


## Add Shortcuts to `package.json`

```json
  "scripts": {
    "build": "hardhat compile",
    "test": "hardhat test",
    "test:watch": "nodemon -e sol,ts --watch contracts --watch test --exec 'hardhat compile; hardhat typechain; hardhat test'",
    "coverage": "hardhat coverage",
    "typechain": "hardhat typechain",
    "deploy": "hardhat deploy"
  }
```


# Setup NFT Contract

- Generate NFT Code on https://wizard.openzeppelin.com/#erc1155
- Add Interfaces and Account-Contract based on https://github.com/vechain/token-bound-accounts/tree/main/contracts/interfaces