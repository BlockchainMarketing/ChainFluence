import { BigNumber, Contract } from 'ethers'
import { Container, Heading, Text } from '@chakra-ui/react'
import { useCollectionCall } from '../../hooks/collection/useCollectionCall'

/**
 * Prop Types
 */
interface HeroProps {
  collection: Contract
}

/**
 * Component
 */
export const Hero = ({ collection }: HeroProps): JSX.Element => {
  const name = useCollectionCall<string>(collection, 'name')
  const totalSupply = useCollectionCall<BigNumber>(collection, 'totalSupply')
  const maxSupply = useCollectionCall<BigNumber>(collection, 'maxSupply')

  return (
    <Container centerContent>
      <Heading>{name || 'Collection'}</Heading>

      <Text mt="4">
        {totalSupply ? totalSupply.toString() : 0}/
        {maxSupply ? maxSupply.toString() : 0} registered influencers.
      </Text>
    </Container>
  )
}
