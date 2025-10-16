import { useEffect, useState } from "react";
import { Box, Heading, Spinner, VStack, Text, Button, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getCars } from "../services/cars";
import type { Car } from "../services/cars";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cars
    getCars()
      .then(setCars)
      .catch((err) => {
        console.error("Failed to fetch cars:", err);
        setError(
          "Failed to load cars. Please make sure the backend server is running."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading size="md">
          Car Rental System 
        </Heading>
        <HStack gap={2}>
          {user ? (
            <>
              <Text>Welcome, {user.name}!</Text>
              <Button onClick={() => navigate("/profile")} size="sm">
                Profile
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} size="sm">
                Login
              </Button>
              <Button onClick={() => navigate("/signup")} colorScheme="blue" size="sm">
                Sign Up
              </Button>
            </>
          )}
        </HStack>
      </HStack>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Box
          p={4}
          bg="red.100"
          borderRadius="md"
          borderLeft="4px solid"
          borderColor="red.500"
        >
          <Text color="red.700" fontWeight="bold">
            Error
          </Text>
          <Text color="red.600">{error}</Text>
        </Box>
      ) : (
        <VStack gap={2} align="start">
          <Heading size="sm" mb={2}>Available Cars</Heading>
          {cars.map((c) => (
            <Text key={c.id}>
              {c.id}. {c.make} — {c.model}
            </Text>
          ))}
        </VStack>
      )}
    </Box>
  );
}