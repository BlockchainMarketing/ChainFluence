import { Text } from '@chakra-ui/react'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { utils } from 'ethers'

/**
 * Component
 */
export function Balance(): JSX.Element {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)
  const finalBalance = etherBalance
    ? parseFloat(utils.formatEther(etherBalance)).toFixed(4)
    : ''
  return <Text>{finalBalance} ETH</Text>
}
