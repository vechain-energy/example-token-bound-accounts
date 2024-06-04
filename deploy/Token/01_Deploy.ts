import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/types';
import type { NFT } from '../../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer, proxyOwner, owner } = await hre.getNamedAccounts();

    // deploy a proxied contract
    await hre.deployments.deploy('NFT', {
        from: deployer,
        contract: 'NFT',
        log: true,
        proxy: {
            owner: proxyOwner,
            proxyContract: 'UUPS',
            execute: {
                init: {
                    methodName: 'initialize',
                    args: [
                        owner, owner, owner, owner
                    ],
                }
            },
        },
        libraries: {
        },
    });

    // read data from contract
    const contract = await hre.ethers.getContract('NFT', proxyOwner) as NFT

    // get role identifier
    const ugpraderRole = await contract.UPGRADER_ROLE()

    // check role for owner
    if (!(await contract.hasRole(ugpraderRole, owner))) {
        console.log('Granting owner UPGRADER_ROLE');

        // execute a function of the deployed contract
        // .wait() waits for the receipts and throws if it reverts
        await (await contract.grantRole(ugpraderRole, owner)).wait()
    }
};

func.id = 'nft'; // name your deployment
func.tags = ['nft']; // tag your deployment, to run certain tags only
func.dependencies = []; // build a dependency tree based on tags, to run deployments in a certain order

export default func;