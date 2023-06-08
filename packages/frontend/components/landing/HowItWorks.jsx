import { CheckCircleIcon } from '@chakra-ui/icons'
import {
  Box,
  Heading,
  Text,
  Flex,
  Image,
  Container,
  Grid,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import { BsCheckCircle } from 'react-icons/bs'

function HowItWorks() {
  return (
    <Box bg="gray.50" py={16} px={8}>
      <Heading size="xl" mb={8} align="center">
        How It Works
      </Heading>
      <Flex
        maxW="container.lg"
        mx="auto"
        direction={{ base: 'column', lg: 'row-reverse' }}
        align="center"
        gap={'24px'}
      >
        <Flex direction={'column'} flex="1" ml={{ lg: 8 }} gap="48px">
          <Box>
            <Heading as="h2" size="lg">
              Create Contests
            </Heading>
            <List spacing={3} mt={4}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Brands create contests with missions/tasks for users to
                complete.
              </ListItem>
            </List>
          </Box>
          <Box>
            <Heading as="h2" size="lg">
              Earn Points
            </Heading>
            <List spacing={3} mt={4}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Users/influencers earn points for completing these tasks.
              </ListItem>
            </List>
          </Box>
          <Box>
            <Heading as="h2" size="lg">
              Win Prizes
            </Heading>
            <List spacing={3} mt={4}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                The more points a user accumulates, the higher their chances of
                winning various prizes.
              </ListItem>
            </List>
          </Box>
        </Flex>
        <Box flex="1">
          <Image src="https://via.placeholder.com/500x500" alt="placeholder" />
        </Box>
      </Flex>
    </Box>
  )
}

export default HowItWorks
