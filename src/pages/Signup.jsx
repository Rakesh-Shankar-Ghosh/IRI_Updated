import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
const Signup = () => {
  const navigate = useNavigate(); // Hook to get the navigate function
  const [auth] = useAuth(); // Only using setAuth, user data is not required

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/profile/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
    country: "",
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    profession: Yup.string().required("Profession is required"),
    country: Yup.string().required("Country is required"),
  });

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
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });

      // If validation succeeds, make API call
      const res = await axios.post(
        `${process.env.REACT_APP_API}/users/signup`,
        formData
      );
      console.log(res.data); // Assuming the API returns the newly created user data
      if (res) {
        alert("Successfully Signup now login please-- see inspect to details");
        navigate("/login");
      }

      // Reset form data
      setFormData({
        name: "",
        email: "",
        password: "",
        profession: "",
        country: "",
      });

      // You can redirect the user to another page or show a success message here
    } catch (error) {
      // If validation fails, handle validation errors
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        console.log(validationErrors);
        // Update state or show error messages to the user
      } else {
        console.error(error);
        // Handle other errors, e.g., show an error message to the user
      }
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      p="6"
      bg="gray.100"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading mb="8" textAlign="center">
        Signup
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb="4">
          <FormLabel>Name:</FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Email:</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Password:</FormLabel>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Profession:</FormLabel>
          <Input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Country:</FormLabel>
          <Input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button colorScheme="blue" type="submit" width="100%">
          Signup
        </Button>

        <Heading mb="8" textAlign="center">
          please open your browser Inspect to see error/details
        </Heading>
      </form>
      <div>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button colorScheme="green" width="100%">
            Login
          </Button>
        </Link>
      </div>
    </Box>
  );
};

export default Signup;
