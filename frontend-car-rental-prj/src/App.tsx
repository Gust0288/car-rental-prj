import { useEffect, useState } from "react";
import { Box, Heading, Spinner, VStack, Text } from "@chakra-ui/react";
import { getCars } from "./services/cars";
import type { Car } from "./services/cars";
import { NavBar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      <NavBar />
      <Heading size="lg" mb={4}>
        Cars
      </Heading>
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
          {cars.map((c) => (
            <Text key={c.id}>
              {c.id}. {c.make} — {c.model}
            </Text>
          ))}
        </VStack>
      )}
      <Footer />
    </Box>
  );
}
