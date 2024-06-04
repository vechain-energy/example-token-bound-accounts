import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();

    // Deploy the ERC6551 Contracts based on https://github.com/vechain/token-bound-accounts
    const registry = await hre.deployments.deploy('ERC6551Registry', { from: deployer })
    const accountErc721 = await hre.deployments.deploy('ERC6551AccountERC721', { from: deployer })
    const accountErc1155 = await hre.deployments.deploy('ERC6551AccountERC1155', { from: deployer })

    console.log('Registry is available at', registry.address)
    console.log('ERC721 Account is available at', accountErc721.address)
    console.log('ERC1155 Account is available at', accountErc1155.address)
};

func.id = 'tba'; // name your deployment
func.tags = ['tba']; // tag your deployment, to run certain tags only
func.dependencies = []; // build a dependency tree based on tags, to run deployments in a certain order

export default func;