import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../utils/verify.ts"
import {
    networkConfig,
    developmentChains,
    PRICE_FEED,
} from "../helper-config"
import { ethers } from "hardhat"

const deployBlockPassContract: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")

    log("Testnet Network detected: Deploying BlockPass Contract...")

    const blockPass = await deploy("BlockPass", {
        from: deployer,
        log: true,
        args: [PRICE_FEED],
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    log(`BlockPass Contract Deployed at ${blockPass.address}`)
    log("---------------------------------------------------")

    log("Deployed Contract address detected: Verifying BlockPass Contract...")

    if (
        (!developmentChains.includes(network.name) &&
            process.env.ETHERSCAN_API_KEY) ||
        process.env.SCROLLSCAN_API_KEY
    ) {
        await verify(blockPass.address, [PRICE_FEED])
    }
}

export default deployBlockPassContract
deployBlockPassContract.tags = ["all", "blockPass"]
