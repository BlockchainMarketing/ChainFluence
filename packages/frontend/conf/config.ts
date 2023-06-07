import {
  ChainId,
  Config,
  Sepolia,
  Goerli,
  Mainnet,
  Hardhat,
} from '@usedapp/core'
import deployedContracts from '../contracts/hardhat_contracts.json'

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY

const config: Config = {
  readOnlyChainId: ChainId.Sepolia,
  readOnlyUrls: {
    [ChainId.Goerli]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    [ChainId.Sepolia]: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
    [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    [ChainId.Hardhat]: 'http://127.0.0.1:8545',
  },
  networks: [Sepolia, Goerli, Hardhat],
  multicallAddresses: {
    [ChainId.Hardhat]:
      deployedContracts[ChainId.Hardhat][0].contracts.Multicall.address,
    [ChainId.Mainnet]: Mainnet.multicallAddress,
  },
}

export const WbtcPorAddress = '0xa81FE04086865e63E12dD3776978E49DEEa2ea4e'

export const FeedRegistryAddress = '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf'

export const LinkTokenAddress = '0x514910771AF9Ca656af840dff83E8264EcF986CA'

export enum Denominations {
  ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  BTC = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  USD = '0x0000000000000000000000000000000000000348',
}

export const OpenSeaUrl = 'https://testnets.opensea.io'

export const VRF_GAS_LANE = {
  [ChainId.Goerli]:
    '0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15',
  [ChainId.Sepolia]:
    '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c',
}

export const VRF_COORDINATOR_V2_ADDRESS = {
  [ChainId.Goerli]: '0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D',
  [ChainId.Sepolia]: '0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625',
}

export const VRF_CALLBACK_GAS_LIMIT = 500000

export default config
