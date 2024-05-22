import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Heading, Button, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [auth] = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/users/getall-users`
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      alert('Are u sure!!')
      await axios.delete(
        `${process.env.REACT_APP_API}/users/delete-user/${id}`
      );
      // After deletion, fetch the updated user list
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/getall-users`
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const navigate = useNavigate();
  const handleGetUser = async (id) => {
    try {
      navigate(`/profile/dashboard/singleuser/${id}`); // Pass user data as state
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box>
        <Heading mb={4}>All Users = {users.length}</Heading>
        {users.map((user) => (
          <Box key={user.id} p={4} borderWidth="4px" borderRadius="md" mb={4}>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Country: {user.country}</Text>
            <Text>Profession: {user.profession}</Text>
            <Flex mt={2}>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteUser(user.id)}
                isDisabled={user.id === auth.user.id}
              >
                Delete
              </Button>
              <Button
                colorScheme="green"
                onClick={() => handleGetUser(user.id)}
              >
                Get Single user
              </Button>
            </Flex>
          </Box>
        ))}
      </Box>
    </Flex>
  );
};

export default GetAllUsers;
