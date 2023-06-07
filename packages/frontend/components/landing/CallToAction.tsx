import { Flex, Heading, Text, Button } from "@chakra-ui/react";

export default function CallToAction() {
    return (
        <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            height="50vh" 
            bgGradient="linear(to-r, blue.500, blue.300)"
            color="white"
        >
            <Heading as="h2" size="2xl">Ready to Get Started?</Heading>
            <Text fontSize="xl" mt={4}>Sign up now and start earning points!</Text>
            <Button colorScheme="pink" mt={8} size="lg">Sign Up</Button>
        </Flex>
    );
}
