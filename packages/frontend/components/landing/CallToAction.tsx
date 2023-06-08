import { Flex, Heading, Text, Button } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function CallToAction() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="50vh"
      background={'teal'}
      color="white"
    >
      <Heading as="h2" size="2xl">
        Ready to Get Started?
      </Heading>
      <Text fontSize="xl" mt={4}>
        Register now to campaign to win some ETH!
      </Text>
      <Button colorScheme={'whiteAlpha'} mt={8} size="lg">
        <NextLink href="/open" passHref>
          See Campaigns
        </NextLink>
      </Button>
    </Flex>
  )
}
