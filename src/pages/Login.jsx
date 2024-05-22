// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Heading,
//   FormControl,
//   FormLabel,
//   Input,
//   Button,
// } from "@chakra-ui/react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const Login = () => {
//   const [auth, setAuth] = useAuth();

//   const navigate = useNavigate(); // Hook to get the navigate function

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Make API call to login endpoint
//       const res = await axios.post(
//         `${process.env.REACT_APP_API}/users/login`,
//         formData
//       );

//       setAuth({
//         ...auth,
//         // user: res.data.user,
//         accessToken: res.data.accessToken,
//       });
//       localStorage.setItem("auth", JSON.stringify(res.data.accessToken));

//       // Reset form data
//       setFormData({
//         email: "",
//         password: "",
//       });

//       if (res.data.success) {
//         alert("You are going to dashboard now");
//         navigate("/profile/dashboard"); // Navigate to the '/dash' route
//       }

//       // You can redirect the user to another page or store authentication token in local storage
//     } catch (error) {
//       console.error(error);
//       // Handle login error, e.g., show an error message to the user
//     }
//   };

//   return (
//     <Box
//       maxW="400px"
//       mx="auto"
//       p="6"
//       bg="gray.100"
//       borderRadius="lg"
//       boxShadow="md"
//     >
//       <Heading mb="8" textAlign="center">
//         Login
//       </Heading>
//       <form onSubmit={handleSubmit}>
//         <FormControl mb="4">
//           <FormLabel>Email:</FormLabel>
//           <Input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </FormControl>
//         <FormControl mb="4">
//           <FormLabel>Password:</FormLabel>
//           <Input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </FormControl>
//         <Button colorScheme="blue" type="submit" width="100%">
//           Login
//         </Button>
//       </form>

//       <div>
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <Button colorScheme="green" width="100%">
//             Signup
//           </Button>
//         </Link>
//       </div>
//     </Box>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Login = () => {
  const [auth, setAuth] = useAuth(); // Only using setAuth, user data is not required
  const navigate = useNavigate(); // Hook to get the navigate function

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/profile/dashboard");
    }
  }, [navigate]);

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
      // Make API call to login endpoint
      const res = await axios.post(
        `${process.env.REACT_APP_API}/users/login`,
        formData
      );

      // Assuming the response contains only the access token
      const { accessToken } = res.data;

      // Set auth state with access token
      setAuth({ ...auth, accessToken });

      localStorage.setItem("auth", JSON.stringify(accessToken));

      // Reset form data
      setFormData({
        email: "",
        password: "",
      });

      if (res.data.success) {
        navigate("/profile/dashboard"); // Navigate to the dashboard route
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle login error, e.g., show an error message to the user
    }
  };

  // Render the login form
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
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
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
        <Button colorScheme="blue" type="submit" width="100%">
          Login
        </Button>
      </form>

      <Box mt="4">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button colorScheme="green" width="100%">
            Signup
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Login;
