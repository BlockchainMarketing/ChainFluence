import React from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { OpenForm } from '../components/forms/OpenForm'
import { Section } from '../components/layout'

function OpenPage(): JSX.Element {
  return (
    <Flex direction="column" align="center" justify="center" minHeight="75vh">
      <Box width="full" maxWidth="container.md" px={8}>
        <Heading as="h1" mb="8">
          Open Campaign
        </Heading>
        <Text fontSize="xl">
          Navigate to the page of a previously deployed campaign.
        </Text>
        <Text fontSize="xs">
          {/* TODO update campaign example address */}
          Example Campaign : 0xbBC67173c4Fa70af411FF5667d811980aaDDF6b6
        </Text>
        <Section>
          <OpenForm />
        </Section>
      </Box>
    </Flex>
  )
}

export default OpenPage
