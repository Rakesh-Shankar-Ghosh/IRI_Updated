import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EditUser = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/users/get-user/${auth.user.id}`
        );
        if (res.data.success) {
          const { name, email, profession, country } = res.data.user;
          setFormData({ name, email, profession, country });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.user?.id) fetchUserData();
  }, [auth?.user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/users/update-user/${auth.user.id}`,
        formData
      );
      if (res.data.success) {
        alert("User updated successfully!");
        navigate("/profile/dashboard"); // Navigate back to the dashboard or wherever appropriate
      } else {
        alert("Failed to update user!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <Box maxWidth="500px" mx="auto" mt="10">
      <Heading mb="6">Edit User</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb="4">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={formData.name || "Enter name"}
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={formData.email || "Enter email"}
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Profession</FormLabel>
          <Input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder={formData.profession || "Enter profession"}
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Country</FormLabel>
          <Input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder={formData.country || "Enter country"}
          />
        </FormControl>
        <Button colorScheme="blue" type="submit">
          Update User
        </Button>
      </form>
    </Box>
  );
};

export default EditUser;
