import { BigNumber, Contract } from 'ethers'
import { Container, Box, HStack, Heading, Text } from '@chakra-ui/react'
import { Loading } from '../Loading'
import { useCollectionCall } from '../../hooks/collection/useCollectionCall'
import { formatTime } from '../../lib/helper'

/**
 * Prop Types
 */
interface DetailsProps {
  collection: Contract
}

/**
 * Components
 */
export const Details = ({ collection }: DetailsProps): JSX.Element => {
  const totalSupply = useCollectionCall<BigNumber>(collection, 'totalSupply')
  const revealedCount = useCollectionCall<BigNumber>(
    collection,
    'revealedCount'
  )
  const batchSize = useCollectionCall<BigNumber>(collection, 'batchSize')
  const nextRevealBatchSize =
    revealedCount &&
    totalSupply &&
    batchSize &&
    batchSize.sub(totalSupply).add(revealedCount)

  const lastRevealed = useCollectionCall<BigNumber>(collection, 'lastRevealed')
  const revealInterval = useCollectionCall<BigNumber>(
    collection,
    'revealInterval'
  )
  const nextRevealTime =
    lastRevealed && revealInterval && lastRevealed.add(revealInterval)

  const shouldReveal = useCollectionCall<boolean>(collection, 'shouldReveal')

  const hasIntervalPassed =
    nextRevealTime && nextRevealTime.toNumber() - Date.now() / 1000 < 0

  return (
    <Container centerContent>
      {shouldReveal && <PendingReveal />}
      {!shouldReveal && (
        <>
          <Heading as="h2">Campaign Details</Heading>
          <Box mt="5">
            {hasIntervalPassed && (
              <>
                <Text as="span" fontWeight="bold">
                  1 NFT
                </Text>
                <Text as="span">
                  {' '}
                  (Interval passed {formatTime(nextRevealTime)})
                </Text>
              </>
            )}
            {!hasIntervalPassed && (
              <>
                <Text fontWeight="bold" as="span" mr="3">
                  {nextRevealBatchSize ? `${nextRevealBatchSize} NFTS` : '... '}
                </Text>
                <Text as="span">or</Text>
                <Text fontWeight="bold" as="span" ml="3">
                  {(nextRevealTime && formatTime(nextRevealTime)) || '...'}
                </Text>
              </>
            )}
          </Box>
        </>
      )}
    </Container>
  )
}

const PendingReveal = (): JSX.Element => (
  <HStack spacing="4">
    <Heading>Pending batch reveal</Heading>
    <Loading />
  </HStack>
)
