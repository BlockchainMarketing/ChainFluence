import { ChainId, Config, MULTICALL_ADDRESSES } from '@usedapp/core'
import LocalhostPriceConsumerV3 from '../artifacts/contracts/localhost/PriceConsumerV3.json'
import RinkebyPriceConsumerV3 from '../artifacts/contracts/rinkeby/PriceConsumerV3.json'
import LocalhostRandomNumberConsumer from '../artifacts/contracts/localhost/RandomNumberConsumer.json'
import RinkebyRandomNumberConsumer from '../artifacts/contracts/rinkeby/RandomNumberConsumer.json'
import MulticallContract from '../artifacts/contracts/localhost/Multicall.json'

export const INFURA_ID = '3982c8198e2b4a65afb505d94129329d'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Localhost]: 'http://localhost:8545',
  },
  supportedChains: [ChainId.Rinkeby, ChainId.Hardhat, ChainId.Localhost],
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
    [ChainId.Hardhat]: MulticallContract.address,
    [ChainId.Localhost]: MulticallContract.address,
  },
}

export type ContractDeployment = {
  address: string
  abi: unknown
}

export const contractConfig: Record<
  number,
  {
    priceConsumer: ContractDeployment
    randomNumberConsumer: ContractDeployment
  }
> = {
  [ChainId.Localhost]: {
    priceConsumer: LocalhostPriceConsumerV3,
    randomNumberConsumer: LocalhostRandomNumberConsumer,
  },
  [ChainId.Rinkeby]: {
    priceConsumer: RinkebyPriceConsumerV3,
    randomNumberConsumer: RinkebyRandomNumberConsumer,
  },
}

export default config
