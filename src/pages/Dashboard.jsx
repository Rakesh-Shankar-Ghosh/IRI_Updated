import React from "react";
import { Button, Flex, Heading, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Flex direction="column" alignItems="center">
      <Heading mb={8}>Dashboard</Heading>
      <Box mb={4}>
        <Link to="/edit-profile">
          <Button colorScheme="blue" size="lg" mr={4}>
            Edit Profile
          </Button>
        </Link>
        <Link to="/change-password">
          <Button colorScheme="green" size="lg" mr={4}>
            Change Password
          </Button>
        </Link>
        <Link to="/getall">
          <Button colorScheme="purple" size="lg" mr={4}>
            Get All Users
          </Button>
        </Link>
        <Link to="/delete-user">
          <Button colorScheme="red" size="lg">
            Delete Single User
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default Dashboard;
