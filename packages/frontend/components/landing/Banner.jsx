import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react'

function Banner() {
  return (
    <Box>
      <Box bg="gray.50" py={16} px={8}>
        <Flex
          maxW="container.lg"
          mx="auto"
          direction={{ base: 'column', lg: 'row' }}
          align="center"
        >
          <Box flex="1" mb={{ base: 8, lg: 0 }} mr={{ lg: 8 }}>
            <Heading size="xl" mb={4}>
              Organize Challenges for Influencers
            </Heading>
            <Text fontSize="lg" mb={8}>
              Set your goal, launch your campaign, reward the one who win.
            </Text>
            <Button size="lg" colorScheme="teal">
              Get Started
            </Button>
          </Box>
          <Box flex="1">
            <Image
              src="https://via.placeholder.com/500x500"
              alt="placeholder"
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default Banner
