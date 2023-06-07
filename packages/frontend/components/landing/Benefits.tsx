import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

export default function Benefits() {
    return (
        <Flex direction={{ base: "column", md: "row" }} bg="gray.100" p={5} justify="space-between">
            <Box flex="1" mr={{ base: "0", md: "2" }}>
                <Heading as="h2" size="lg">Benefits for Brands</Heading>
                <Flex align="center" mt={4}>
                    <Icon as={CheckIcon} color="green.500" mr={2} />
                    <Text>Increased exposure and engagement.</Text>
                </Flex>
            </Box>
            <Box flex="1" mt={{ base: "4", md: "0" }}>
                <Heading as="h2" size="lg">Benefits for Influencers</Heading>
                <Flex align="center" mt={4}>
                    <Icon as={CheckIcon} color="green.500" mr={2} />
                    <Text>The chance to win amazing prizes.</Text>
                </Flex>
            </Box>
        </Flex>
    );
}
