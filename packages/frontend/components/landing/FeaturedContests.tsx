import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Grid, Heading, Text, Card, Link } from '@chakra-ui/react'
import { Section } from '../layout'

export default function FeaturedContests() {
  return (
    <Box p={5}>
      <Heading as="h2" size="xl">
        Featured Contests
      </Heading>
      <Text mt={4}>
        Check out some of the awesome contests that brands have created on our
        platform.
      </Text>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={6}
        mt={6}
      >
        {/* You would typically loop through your contests data and display them here. */}
        <Section>
          <Heading as="h2" size="md" mb="2">
            Batch NFT Demo App
          </Heading>
          <Text mb="4">
            Create batch-revealed NFT collections powered by Chainlink
            Automation & VRF.
          </Text>
          <Link href="https://automation.chainlink-demo.app" isExternal>
            Go to Demo <ExternalLinkIcon mx="2px" />
          </Link>
        </Section>

        <Section>
          <Heading as="h2" size="md" mb="2">
            Batch NFT Demo App
          </Heading>
          <Text mb="4">
            Create batch-revealed NFT collections powered by Chainlink
            Automation & VRF.
          </Text>
          <Link href="https://automation.chainlink-demo.app" isExternal>
            Go to Demo <ExternalLinkIcon mx="2px" />
          </Link>
        </Section>
        <Section>
          <Heading as="h2" size="md" mb="2">
            Batch NFT Demo App
          </Heading>
          <Text mb="4">
            Create batch-revealed NFT collections powered by Chainlink
            Automation & VRF.
          </Text>
          <Link href="https://automation.chainlink-demo.app" isExternal>
            Go to Demo <ExternalLinkIcon mx="2px" />
          </Link>
        </Section>
      </Grid>
    </Box>
  )
}
