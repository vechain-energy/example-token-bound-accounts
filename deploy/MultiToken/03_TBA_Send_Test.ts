
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/types';
import type { ERC6551Registry, MultiToken, ERC6551AccountERC1155 } from '../../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer, proxyOwner, owner } = await hre.getNamedAccounts();

    const tokenId = 0
    const multiToken = await hre.ethers.getContract('MultiToken') as MultiToken
    const tokenBalance = await multiToken.balanceOf(owner, tokenId)
    if (!tokenBalance) { return }

    const chainId = BigInt((await hre.ethers.provider.getBlock(0))?.hash ?? 0)
    const salt = tokenId

    const registry = await hre.ethers.getContract('ERC6551Registry') as ERC6551Registry
    const accountImplementation = await hre.ethers.getContract('ERC6551AccountERC1155') as ERC6551AccountERC1155
    const accountAddress = await registry.account(
        await accountImplementation.getAddress(),
        chainId,
        await multiToken.getAddress(),
        tokenId,
        salt,
    )

    const tba = await hre.ethers.getContractAt('ERC6551AccountERC1155', accountAddress)
    console.log('MultiTBA Owner', await tba.owner())

    const vetBalance = await hre.ethers.provider.getBalance(accountAddress);
    console.log('VET Balance is', hre.ethers.formatEther(vetBalance));

    const vtho = await hre.ethers.getContractAt('ERC20', '0x0000000000000000000000000000456e65726779')
    const vthoBalance = await vtho.balanceOf(accountAddress);
    console.log('VTHO Token Balance is', hre.ethers.formatUnits(vthoBalance, 18));

    if (!vthoBalance && vetBalance > 0) {
        console.log('Sending VET Balance to', owner)
        await tba.execute(owner, vetBalance, "0x", 0)
    }

    else if (vthoBalance > 0) {
        console.log('Sending VET & VTHO Balance to', owner)
        await tba.execute(
            await vtho.getAddress(),
            vetBalance,
            vtho.interface.encodeFunctionData("transfer", [owner, vthoBalance]),
            0
        )
    }
};

func.id = 'nft-mint-token-0'; // name your deployment
func.tags = ['test']; // tag your deployment, to run certain tags only
func.dependencies = ['tba', 'nft']; // build a dependency tree based on tags, to run deployments in a certain order

export default func;