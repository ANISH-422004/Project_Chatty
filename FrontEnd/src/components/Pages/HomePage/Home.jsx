import React from "react";
import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import Login from "../../Authentication/Login/Login";
import Register from "../../Authentication/Register/Register";

const Home = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.100"
      >
        <Text
          textAlign="center"
          color="Black"
          fontSize="3xl"
          fontFamily="work sans"
        >
          Chatty
        </Text>
      </Box>
      <Box
        bg="white"
        p={4}
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.100"
      >
        <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"tab-1"}>
          <Tabs.List backgroundColor="white">
            <Tabs.Trigger w="50%" value="tab-1">
              Log In
            </Tabs.Trigger>
            <Tabs.Trigger w="50%" value="tab-2">
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab-1">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="tab-2">
            <Register />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Home;
