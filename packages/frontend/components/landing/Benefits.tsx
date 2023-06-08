import { Flex, Heading, Text, Icon } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

export default function Benefits() {
  return (
    <Flex direction={'column'} gap={'8px'} bg="gray.100" p={5}>
      <Flex justify={'center'}>
        {/* @ts-expect-error */}
        <Heading size="xl" mb={8} align="center">
          It&lsquo;s a Win Win
        </Heading>
      </Flex>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        p={5}
        justify="space-between"
      >
        <Flex
          direction={'column'}
          align={'center'}
          flex="1"
          mr={{ base: '0', md: '2' }}
        >
          <Heading as="h2" size="lg">
            Benefits for Brands
          </Heading>
          <Flex align="center" mt={4}>
            <Icon as={CheckIcon} color="green.500" mr={2} />
            <Text>Increased exposure and engagement.</Text>
          </Flex>
        </Flex>
        <Flex
          direction={'column'}
          align={'center'}
          flex="1"
          mt={{ base: '4', md: '0' }}
        >
          <Heading as="h2" size="lg">
            Benefits for Influencers
          </Heading>
          <Flex align="center" mt={4}>
            <Icon as={CheckIcon} color="green.500" mr={2} />
            <Text>The chance to win amazing prizes.</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
