import { Box, Grid, Heading, List, ListItem, ListIcon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export default function HowItWorks() {
    return (
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} p={5}>
            <Box>
                <Heading as="h2" size="lg">Create Contests</Heading>
                <List spacing={3} mt={4}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Brands create contests with missions/tasks for users to complete.
                    </ListItem>
                </List>
            </Box>
            <Box>
                <Heading as="h2" size="lg">Earn Points</Heading>
                <List spacing={3} mt={4}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Users/influencers earn points for completing these tasks.
                    </ListItem>
                </List>
            </Box>
            <Box>
                <Heading as="h2" size="lg">Win Prizes</Heading>
                <List spacing={3} mt={4}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        The more points a user accumulates, the higher their chances of winning various prizes.
                    </ListItem>
                </List>
            </Box>
        </Grid>
    );
}
