import { Flex, Heading, Text, Button } from '@chakra-ui/react'

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
        Sign up now and start earning points!
      </Text>
      <Button colorScheme={'whiteAlpha'} color={'teal'} mt={8} size="lg">
        Sign Up
      </Button>
    </Flex>
  )
}
