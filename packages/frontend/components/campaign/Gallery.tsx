import React from 'react'
import { useEthers } from '@usedapp/core'
import { Contract } from 'ethers'
import {
  Container,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Heading,
  Text,
  Link,
} from '@chakra-ui/react'
// import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useAllTokens } from '../../hooks/collection/useAllTokens'
import { useOwnedTokens } from '../../hooks/collection/useOwnedTokens'
import { InfluencerGrid } from './InfluencerGrid'

/**
 * Prop Types
 */
interface GalleryProps {
  collection: Contract
}

/**
 * Components
 */
export const Gallery = ({ collection }: GalleryProps): JSX.Element => {
  const { account } = useEthers()

  const allTokenUris = useAllTokens(collection)
  const allTokenUrisSorted = [...allTokenUris].reverse()

  const ownedTokenUris = useOwnedTokens(collection, account)
  const ownedTokenUrisSorted = [...ownedTokenUris].reverse()

  return (
    <>
      <GalleryInfo />
      <Tabs>
        <TabList>
          <GalleryTab>Registered influencers</GalleryTab>
          <GalleryTab isDisabled>Winners</GalleryTab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <InfluencerGrid influencerAddresses={allTokenUrisSorted} />
          </TabPanel>
          <TabPanel>
            <InfluencerGrid influencerAddresses={ownedTokenUrisSorted} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

const GalleryTab = ({
  children,
  isDisabled = false,
}: {
  children: React.ReactNode
  isDisabled?: boolean
}) => (
  <Tab isDisabled={isDisabled} _selected={{ color: 'white', bg: 'teal' }}>
    {children}
  </Tab>
)

const GalleryInfo = () => (
  <Container pb="12" textAlign="center">
    <Heading as="h2" size="lg" pb="4">
      Registered Influencers
    </Heading>
    <Text pb="4">
      Influencers can register until campaign launch. After the launch,
      they&lsquo;ll have to each the threshold of $validationThreshold retweets,
      you will be able to share the price of $validationThreshold.
    </Text>
    <Link href="/">
      Learn More
      {/* <ExternalLinkIcon mx="2px" /> */}
    </Link>
  </Container>
)
