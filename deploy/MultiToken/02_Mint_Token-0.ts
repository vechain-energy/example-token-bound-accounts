
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/types';
import type { ERC6551Registry, MultiToken } from '../../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { owner } = await hre.getNamedAccounts();
    const tokenId = 0

    const multiToken = await hre.ethers.getContract('MultiToken') as MultiToken
    const registry = await hre.ethers.getContract('ERC6551Registry') as ERC6551Registry
    const accountImplementation = await hre.ethers.getContract('ERC6551AccountERC1155')

    if (!(await multiToken['totalSupply(uint256)'](tokenId))) {
        console.log('Minting Initial MultiToken')
        await multiToken.mint(owner, tokenId, 1, "0x")
    }

    const tokenBalance = await multiToken.balanceOf(owner, tokenId)
    if (!tokenBalance) { return }

    const chainId = BigInt((await hre.ethers.provider.getBlock(0))?.hash ?? 0)
    const salt = tokenId

    const accountAddress = await registry.account(
        await accountImplementation.getAddress(),
        chainId,
        await multiToken.getAddress(),
        tokenId,
        salt,
    )
    console.log('MultiToken Bound Account for', tokenId, 'is', accountAddress)

    const accountCode = await hre.ethers.provider.getCode(accountAddress);
    if (accountCode === '0x') {
        console.log('no code found on account address.')
        console.log('Creating MultiToken Bound Account')
        await registry.createAccount(
            await accountImplementation.getAddress(),
            chainId,
            await multiToken.getAddress(),
            tokenId,
            salt,
            "0x"
        )
    }
};

func.id = 'multi-nft-mint-token-0'; // name your deployment
func.tags = ['test']; // tag your deployment, to run certain tags only
func.dependencies = ['tba', 'nft']; // build a dependency tree based on tags, to run deployments in a certain order

export default func;