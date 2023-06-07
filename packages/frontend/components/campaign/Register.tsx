import { useState } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import { BigNumber, Contract } from 'ethers'
import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { Error } from '../Error'
import { useCollectionCall } from '../../hooks/collection/useCollectionCall'

/**
 * Prop Types
 */
interface RegisterProps {
  collection: Contract
}

/**
 * Component
 */
export const Register = ({ collection }: RegisterProps): JSX.Element => {
  const { account } = useEthers()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [twitterHandle, setTwitterHandle] = useState(1)
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(true)

  const totalSupply = useCollectionCall<BigNumber>(collection, 'totalSupply')
  const mintCost = useCollectionCall<BigNumber>(collection, 'mintCost')
  const maxSupply = useCollectionCall<BigNumber>(collection, 'maxSupply')

  // TODO update this condition
  const hasReachedMaxSupply =
    totalSupply && maxSupply && totalSupply.gte(maxSupply)

  const { /*send,*/ state } = useContractFunction(collection, 'mint')
  const isLoading = state.status === 'Mining'

  return (
    <Container centerContent>
      {state.errorMessage && <Error message={state.errorMessage} />}
      <Heading as="h2">Register</Heading>
      <Flex mt={5}>
        {/* // TODO move FormLabel and input on the same line */}
        <Tooltip
          label="Set dot separated path to find the desired data in the API response"
          placement="right-start"
          fontSize="xs"
          hasArrow
        >
          <Input
            value={''}
            placeholder="Twitter handle @"
            id="twitter-handle"
            bgColor="white"
            onChange={(e: any) => {
              try {
                setTwitterHandle(e.target.value)
                setIsRegisterDisabled(false)
              } catch (error) {
                setIsRegisterDisabled(true)
              }
            }}
          />
        </Tooltip>
        <Button
          isLoading={isLoading}
          colorScheme="teal"
          disabled={
            isRegisterDisabled ||
            !account ||
            hasReachedMaxSupply ||
            isLoading ||
            !mintCost
          }
          ml="4"
          px="8"
          // TODO register user
          // onClick={() => {
          //   send(twitterHandle, {
          //     value: mintCost.mul(mintAmount),
          //   })
          // }}
        >
          Register
        </Button>
      </Flex>

      <Text mt="4">
        If you reach the threshold of $validationThreshold retweets, you will be
        able to share the price of $validationThreshold.
      </Text>
    </Container>
  )
}
