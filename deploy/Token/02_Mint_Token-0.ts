
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/types';
import type { ERC6551Registry, NFT } from '../../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { owner } = await hre.getNamedAccounts();

    const nft = await hre.ethers.getContract('NFT') as NFT
    const registry = await hre.ethers.getContract('ERC6551Registry') as ERC6551Registry
    const accountImplementation = await hre.ethers.getContract('ERC6551Account') as ERC6551Registry

    if (!(await nft.totalSupply())) {
        console.log('Minting Initial Token')
        await nft.safeMint(owner, "")
    }

    const tokenBalance = await nft.balanceOf(owner)
    if (!tokenBalance) { return }

    const chainId = BigInt((await hre.ethers.provider.getBlock(0))?.hash ?? 0)
    const tokenId = await nft.tokenOfOwnerByIndex(owner, 0)
    const salt = tokenId

    const accountAddress = await registry.account(
        await accountImplementation.getAddress(),
        chainId,
        await nft.getAddress(),
        tokenId,
        salt,
    )
    console.log('Token Bound Account for', tokenId, 'is', accountAddress)

    const accountCode = await hre.ethers.provider.getCode(accountAddress);
    if (accountCode === '0x') {
        console.log('no code found on account address.')
        console.log('Creating Token Bound Account')
        await registry.createAccount(
            await accountImplementation.getAddress(),
            chainId,
            await nft.getAddress(),
            tokenId,
            salt,
            "0x"
        )
    }
};

func.id = 'nft-mint-token-0'; // name your deployment
func.tags = ['test']; // tag your deployment, to run certain tags only
func.dependencies = ['tba', 'nft']; // build a dependency tree based on tags, to run deployments in a certain order

export default func;