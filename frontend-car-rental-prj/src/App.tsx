import { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text, Container } from "@chakra-ui/react";
import { getCars } from "./services/cars";
import type { Car } from "./services/cars";
import { NavBar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import { CarGrid } from "./Components/CarGrid";

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

  const handleCarClick = (car: Car) => {
    console.log("Car clicked:", car);
    // You can add navigation to car details page here later
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <NavBar />
      <Box flex="1" p={6}>
        <Container maxW="7xl" centerContent>
          <Heading size="lg" mb={6} alignSelf="start">
            Available Cars
          </Heading>
          {loading ? (
            <Spinner size="xl" />
          ) : error ? (
            <Box
              p={4}
              bg="red.100"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="red.500"
              w="100%"
              maxW="md"
            >
              <Text color="red.700" fontWeight="bold">
                Error
              </Text>
              <Text color="red.600">{error}</Text>
            </Box>
          ) : cars.length === 0 ? (
            <Text fontSize="lg" color="gray.500">
              No cars available at the moment.
            </Text>
          ) : (
            <CarGrid cars={cars} onCarClick={handleCarClick} />
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
