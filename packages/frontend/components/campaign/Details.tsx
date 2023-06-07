import { Contract } from 'ethers'
import {
  Container,
  Box,
  HStack,
  Heading,
  Text,
  Link,
  Stack,
} from '@chakra-ui/react'

import { ExternalLinkIcon } from '@chakra-ui/icons'

/**
 * Prop Types
 */
interface DetailsProps {
  collection: Contract
}

/**
 * Components
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Details = ({ collection }: DetailsProps): JSX.Element => {
  // const totalSupply = useCollectionCall<BigNumber>(collection, 'totalSupply')
  // const revealedCount = useCollectionCall<BigNumber>(
  //   collection,
  //   'revealedCount'
  // )
  // const batchSize = useCollectionCall<BigNumber>(collection, 'batchSize')

  // const lastRevealed = useCollectionCall<BigNumber>(collection, 'lastRevealed')
  // const revealInterval = useCollectionCall<BigNumber>(
  //   collection,
  //   'revealInterval'
  // )
  // const nextRevealTime =
  //   lastRevealed && revealInterval && lastRevealed.add(revealInterval)

  // const shouldReveal = useCollectionCall<boolean>(collection, 'shouldReveal')

  // const hasIntervalPassed =
  //   nextRevealTime && nextRevealTime.toNumber() - Date.now() / 1000 < 0

  return (
    <Container centerContent>
      <Heading as="h2">Campaign Details</Heading>
      <Stack align="start">
        <Box mt="8">
          <Heading as="h6">Budget</Heading>
          <Text my="4">
            The total budget allocated to your campaign (in ETH).
          </Text>
        </Box>
        <Box mt="8">
          <Heading as="h6">Retweet Milestone</Heading>
          <Text my="4">
            Minimum amount of retweets for a participant to win.
          </Text>
        </Box>
        <Box mt="8">
          <Heading as="h6">Number of winners</Heading>
          <Text my="4">Maximum number of winners for this campaign.</Text>
        </Box>
      </Stack>
      <HStack mt="4">
        <Link
          href="https://docs.chain.link/docs/reference-contracts"
          isExternal
        >
          Contract Addresses <ExternalLinkIcon mx="2px" />
        </Link>
      </HStack>
    </Container>
  )
}
