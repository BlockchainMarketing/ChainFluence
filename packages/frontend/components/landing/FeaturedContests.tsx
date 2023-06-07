import { Box, Grid, Heading, Text, Card } from "@chakra-ui/react";

export default function FeaturedContests() {
    return (
        <Box p={5}>
            <Heading as="h2" size="xl">Featured Contests</Heading>
            <Text mt={4}>Check out some of the awesome contests that brands have created on our platform.</Text>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mt={6}>
                {/* You would typically loop through your contests data and display them here. */}
                <Card p={4} bg="white" boxShadow="md">
                    <Heading size="md">Contest Title</Heading>
                    {/* More details about the contest */}
                </Card>
                <Card p={4} bg="white" boxShadow="md">
                    <Heading size="md">Contest Title</Heading>
                    {/* More details about the contest */}
                </Card>
                <Card p={4} bg="white" boxShadow="md">
                    <Heading size="md">Contest Title</Heading>
                    {/* More details about the contest */}
                </Card>
            </Grid>
        </Box>
    );
}
