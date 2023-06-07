import { useState } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import { BigNumber, Contract } from 'ethers'
import {
  Button,
  Container,
  Flex,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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

  const [twitterHandle, setTwitterHandle] = useState(1)
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(true)

  const name = useCollectionCall<string>(collection, 'name')
  const symbol = useCollectionCall<string>(collection, 'symbol')
  const totalSupply = useCollectionCall<BigNumber>(collection, 'totalSupply')
  const mintCost = useCollectionCall<BigNumber>(collection, 'mintCost')
  const maxSupply = useCollectionCall<BigNumber>(collection, 'maxSupply')

  const hasReachedMaxSupply =
    totalSupply && maxSupply && totalSupply.gte(maxSupply)

  const { send, state } = useContractFunction(collection, 'mint')
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
            // onChange={(e) => setTwitterHandle(e.target.value)}
            // onChange={(valueAsString: string, valueAsNumber: number) => {
            onChange={(e: any) => {
              // checks if new value is not a number
              // in JS NaN == NaN equals false so isNaN() is necessary.
              if (isNaN(parseInt(e.target.value)))) {
                setIsRegisterDisabled(true)
              } else {
                setIsRegisterDisabled(false)
              }
              setRegisterAmount(e.target.value))
            }}
          />
        </Tooltip>
        {/* TODO put button on a new line and center */}
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
          onClick={() => {
            send(mintAmount, {
              value: mintCost.mul(mintAmount),
            })
          }}
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
