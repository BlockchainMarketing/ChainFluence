import React, { useCallback, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { Text, Heading, Flex, Box } from '@chakra-ui/react'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Section } from '../components/layout'

import { Error } from '../components/Error'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { SuccessDialog } from '../components/dialogs/SuccessDialog'
import { deployCampaignCollection } from '../lib/deploy'
import { CreateCampaignForm } from '../components/forms/CreateCampaignForm'
import { CreateCampaignFormValues } from '../types/CreateFormValues'
import { useContract } from '../hooks/useContract'
import { useCampaignContract } from '../hooks/campaign/useCampaignContract'

interface DeployedContract {
  address: string
  txHash: string
  name: string
}

function CreatePage(): JSX.Element {
  const { library } = useEthers()

  const [deployedContract, setDeployedContract] = useState<
    DeployedContract | undefined
  >()

  const contract = useContract('ChainFluenceV1')
  console.log('🚀 ~ file: create.tsx:29 ~ CreatePage ~ contract:', contract)

  // const { contract, loading, error } = useCollectionContract(address)
  // const contract = useCampaignContract()
  // console.log('🚀 ~ file: create.tsx:32 ~ CreatePage ~ contract:', contract)

  // const { send, state } = useContractFunction(contract, 'createCampaign')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = useCallback(
    async (args: CreateCampaignFormValues) => {
      setError('')

      if (!(library instanceof JsonRpcProvider)) {
        return null
      }

      let tx: TransactionReceipt
      try {
        // const call = await send(...args)
        // const contract = await deployCampaignCollection(
        //   args,
        //   library?.getSigner()
        // )
        setIsLoading(true)
        // tx = await contract.deployTransaction.wait()
        // tx = await call.wait()
      } catch (ex) {
        setError(ex.reason || ex.message || 'Unsuccessful deployment')
        return
      } finally {
        setIsLoading(false)
      }
      setDeployedContract({
        address: tx.contractAddress,
        txHash: tx.transactionHash,
        name: args.name,
      })
    },
    [library]
  )

  return (
    <Flex direction="column" align="center" justify="center" minHeight="75vh">
      <Box width="full" maxWidth="container.md" px={8}>
        <Heading as="h1" mb="8">
          Create Campaign
        </Heading>
        <Text fontSize="xl">
          Setup a campaign with the best influence&lsquo;s.
        </Text>
        <Section>
          {deployedContract && (
            <SuccessDialog
              contractAddress={deployedContract.address}
              deployTxHash={deployedContract.txHash}
              campaignName={deployedContract.name}
            />
          )}
          {!deployedContract && (
            <CreateCampaignForm onSubmit={onSubmit} isLoading={isLoading} />
          )}
          {/* @ts-expect-error */}
          {error && <Error message={error} mt="2" />}
        </Section>
      </Box>
    </Flex>
  )
}

export default CreatePage
