import { Flex, Heading, Text, Button } from "@chakra-ui/react";

export default function Hero() {
    return (
        <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            height="70vh" 
            bgGradient="linear(to-r, blue.500, blue.300)"
            color="white"
        >
            <Heading as="h1" size="3xl">Welcome to ChaInfluence</Heading>
            <Text fontSize="xl" mt={4}>A platform that fosters a mutually beneficial relationship between brands and influencers.</Text>
            <Button colorScheme="pink" mt={8} size="lg">Get Started</Button>
        </Flex>
    );
}
