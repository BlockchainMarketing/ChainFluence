import { ethers, run } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

import { networkConfig } from '../config/networkConfig'
import { delay } from '../helpers/delay'

const func: DeployFunction = async function ({
  deployments,
  getChainId,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments
  const { deployer: deployerAddress } = await getNamedAccounts()
  const chainId = await getChainId()

  const isLocalDeployment = chainId === '31337' || chainId === '1337'

  let linkTokenAddress: string
  if (chainId === '31337' || chainId === '1337') {
    const linkToken = await deployments.get('LinkToken')
    linkTokenAddress = linkToken.address
  } else {
    linkTokenAddress = networkConfig[chainId].linkToken as string
  }

  if (!linkTokenAddress)
    throw new Error(`Link token address not found for chainId ${chainId}`)

  const deployer = await ethers.getSigner(deployerAddress)

  const options = {
    from: deployerAddress,
    nonce: 'pending',
    log: true,
  }

  const apiBaseUrl = 'https://giveaway.lfgames.workers.dev'
  const treasuryFee = 500 // 5%
  const oracleId = '0xCC79157eb46F5624204f47AB42b3906cAA40eaB7'
  const jobId = '7223acbd01654282865b678924126013'

  const parsedJobId = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(jobId))

  log('Deploying Twitter contract')

  const twitterArgs = [
    parsedJobId,
    apiBaseUrl,
    oracleId,
    linkTokenAddress,
    treasuryFee,
  ]

  const {
    address: twitterAddress,
    newlyDeployed: twitterNewlyDeployed,
    // @ts-expect-error
    receipt: { gasUsed: twitterGasUsed },
  } = await deploy('TwitterV1', {
    ...options,
    args: twitterArgs,
  })

  if (twitterNewlyDeployed)
    log(
      `✅ Contract Twitter deployed at ${twitterAddress} using ${twitterGasUsed} gas`
    )

  if (isLocalDeployment || !twitterNewlyDeployed) return

  log(`🕦 Waiting before verification...`)
  await delay(30 * 1000)
  try {
    log(`✅ Verifying contract Twitter`)
    await run('verify:verify', {
      address: twitterAddress,
      constructorArguments: twitterArgs,
    })
    log(`🕧 Waiting post verification...`)
    await delay(10 * 1000)
  } catch (error: any) {
    console.error('Error during contract verification', error.message)
  }
}

func.tags = ['all', 'test', 'dev', 'staging', 'prod', 'twitter']

export default func
