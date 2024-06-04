import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();

    // Deploy the ERC6551 Contracts based on https://github.com/vechain/token-bound-accounts
    const registry = await hre.deployments.deploy('ERC6551Registry', { from: deployer })
    const account = await hre.deployments.deploy('ERC6551Account', { from: deployer })

    console.log('Registry is available at', registry.address)
    console.log('Account is available at', account.address)
};

func.id = 'tba'; // name your deployment
func.tags = ['tba']; // tag your deployment, to run certain tags only
func.dependencies = []; // build a dependency tree based on tags, to run deployments in a certain order

export default func;