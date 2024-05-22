import React, { useEffect, useState } from "react";
import { Button, Text, Flex, Heading, Box } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/users/logout`);
      if (res.data.success) {
        // setAuth({
        //   ...auth,
        //   user: '',
        //   accessToken: '',
        // });
        localStorage.removeItem("auth");
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: "",
          accessToken: "",
        }));

        navigate("/login");
      }
      // You can perform any additional actions after successful logout if needed
    } catch (error) {
      console.error("Error during logout:", error);
      // You can handle the error here, such as displaying a message to the user
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/users/get-user/${auth.user.id}`
        );
        if (res.data.success) {
          // Update the auth context with the latest user data
          setAuth({
            ...auth,
            user: res.data.user,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.user?.id) fetchUserData();
  }, [auth?.user?.id, auth.accessToken, setAuth, auth]);

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/login");
    }
  }, [auth.accessToken, navigate]);

  if (loading) {
    return <div>Dash Loading...</div>; // Show a loading indicator while fetching data
  }

  if (!auth.accessToken) {
    return null; // Render nothing or a loading spinner if not authenticated
  }

  return (
    <Flex direction="column" alignItems="center" backgroundColor="gray">
      <Heading mb={8}>User Dashboard</Heading>
      <Box mb={4}>
        <Link to="/profile/dashboard/edit-user">
          <Button colorScheme="blue" size="lg" mr={4}>
            Edit Profile
          </Button>
        </Link>
        <Link to="/profile/dashboard/change-password">
          <Button colorScheme="green" size="lg" mr={4}>
            Change Password
          </Button>
        </Link>
        <Link to="/profile/dashboard/getall">
          <Button colorScheme="purple" size="lg" mr={4}>
            Get All Users
          </Button>
        </Link>

        <Button colorScheme="red" size="lg" onClick={handleLogout}>
          Log Out
        </Button>
      </Box>
      <Text fontSize="lg" fontWeight="bold">
        Welcome, {auth.user.name}
      </Text>
      <Text fontSize="md">{auth.user.email}</Text>
      <Text fontSize="md">{auth.user.profession}</Text>
      <Text fontSize="md">{auth.user.country}</Text>
    </Flex>
  );
};

export default Dashboard;
