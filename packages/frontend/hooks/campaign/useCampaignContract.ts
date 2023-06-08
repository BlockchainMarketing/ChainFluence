import { useEffect, useMemo, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract, ethers } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { getNetworkName } from '../../lib/utils'

import ChainFluenceV1 from '../../artifacts/contracts/ChainFluenceV1.sol/ChainFluenceV1.json'
const { abi } = ChainFluenceV1

export function useCampaignContract<T extends Contract = Contract>() {
  const address = process.env.NEXT_PUBLIC_CHAINFLUENCE_CONTRACT_ADDRESS
  const { library, chainId, account } = useEthers()

  const contract = useMemo(() => {
    if (!address) return null
    if (!library) return null

    if (!(library instanceof JsonRpcProvider)) {
      return null
    }

    return new ethers.Contract(address, abi, library.getSigner()) as T
  }, [address, library])

  const [isContract, setIsContract] = useState<boolean | undefined>()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (library instanceof JsonRpcProvider && address) {
      setLoading(true)
      checkContract(library, address).then((result) => {
        setIsContract(result)
        setLoading(false)
      })
    }
  }, [library, address, chainId])

  let error = ''
  if (!account) {
    error = 'No wallet connected.'
  } else if (!isAddress(address)) {
    error = 'Invalid address.'
  } else if (isContract === false) {
    const network = getNetworkName(chainId) || 'this network'
    error = `Contract does not exist on ${network}.`
  }

  return {
    contract,
    loading,
    error,
  }
}

async function checkContract(
  library: ethers.providers.JsonRpcProvider,
  address: string
) {
  if (!isAddress(address)) {
    return false
  }
  const code = await library.getCode(address)
  return code !== '0x'
}
