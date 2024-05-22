//

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// Validation schema
const validationSchema = yup.object().shape({
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup
    .string()
    .required("New Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

const ChangePassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [auth, setAuth] = useAuth();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/users/update-password/${auth.user.id}`,
        {
          oldPassword: values.oldPassword,
          password: values.newPassword,
          confirmPassword: values.confirmPassword,
        }
      );
      if (res.data.success) {
        alert("Password updated successfully!");
        localStorage.removeItem("auth");
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: "",
          accessToken: "",
        }));
        navigate("/login"); // Navigate back to the login page
      } else {
        setError("Failed to update password");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Failed to update password");
      }
      console.error("Error updating password:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxWidth="500px" mx="auto" mt="10">
      <Heading mb="6">Change Password</Heading>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl mb="4">
              <FormLabel>Old Password</FormLabel>
              <InputGroup>
                <Field
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  as={Input}
                  placeholder="Enter old password"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    icon={
                      showOldPassword ? <AiFillEyeInvisible /> : <AiFillEye />
                    }
                  />
                </InputRightElement>
              </InputGroup>
              <Text color="red.500" fontSize="sm">
                <ErrorMessage name="oldPassword" />
              </Text>
            </FormControl>
            <FormControl mb="4">
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Field
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  as={Input}
                  placeholder="Enter new password"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    icon={
                      showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />
                    }
                  />
                </InputRightElement>
              </InputGroup>
              <Text color="red.500" fontSize="sm">
                <ErrorMessage name="newPassword" />
              </Text>
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  as={Input}
                  placeholder="Confirm new password"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    icon={
                      showConfirmPassword ? (
                        <AiFillEyeInvisible />
                      ) : (
                        <AiFillEye />
                      )
                    }
                  />
                </InputRightElement>
              </InputGroup>
              <Text color="red.500" fontSize="sm">
                <ErrorMessage name="confirmPassword" />
              </Text>
            </FormControl>
            {error && (
              <Text color="red.500" fontSize="sm" mb="4">
                {error}
              </Text>
            )}
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ChangePassword;
