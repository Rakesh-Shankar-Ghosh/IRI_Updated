import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Spinner, 
  Alert, 
  AlertIcon, 
  Container 
} from "@chakra-ui/react";


const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/users/get-user/${id}`
        );
        setUser(response.data.user);
      } catch (error) {
        setError("Error fetching user");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Container maxW="container.md" py={4}>
      {user && (
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <VStack align="start" spacing={4}>
            <Heading as="h2" size="xl">
              User Details
            </Heading>
            <Text fontSize="lg"><strong>Name:</strong> {user.name}</Text>
            <Text fontSize="lg"><strong>Email:</strong> {user.email}</Text>
            <Text fontSize="lg"><strong>Country:</strong> {user.country}</Text>
            <Text fontSize="lg"><strong>Profession:</strong> {user.profession}</Text>
          </VStack>
        </Box>
      )}
    </Container>
  );
};

export default SingleUser;
