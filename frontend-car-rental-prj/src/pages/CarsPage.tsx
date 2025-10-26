import { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text, Container, VStack } from "@chakra-ui/react";
import { getCars } from "../services/cars";
import type { Car } from "../services/cars";
import { CarGrid } from "../Components/CarGrid";

export default function CarsPage() {
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

  // Remove duplicates based on make and model combination
  const removeDuplicateCars = (cars: Car[]) => {
    const seen = new Set<string>();
    return cars.filter(car => {
      const key = `${car.make}-${car.model}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  // Capitalize first letter of each word
  const capitalizeString = (str: string) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Group cars by make
  const groupCarsByMake = (cars: Car[]) => {
    const grouped = cars.reduce((acc, car) => {
      const make = car.make;
      if (!acc[make]) {
        acc[make] = [];
      }
      acc[make].push(car);
      return acc;
    }, {} as Record<string, Car[]>);

    // Sort makes alphabetically
    const sortedMakes = Object.keys(grouped).sort();
    const sortedGrouped: Record<string, Car[]> = {};
    sortedMakes.forEach(make => {
      sortedGrouped[make] = grouped[make];
    });

    return sortedGrouped;
  };

  const uniqueCars = removeDuplicateCars(cars);
  const groupedCars = groupCarsByMake(uniqueCars);

  return (
    <Box p={6}>
      <Container maxW="7xl">
        <Heading size="lg" mb={6} textAlign="center">
          All Available Cars
        </Heading>
        
        {loading ? (
          <Box textAlign="center">
            <Spinner size="xl" />
          </Box>
        ) : error ? (
          <Box
            p={4}
            bg="red.100"
            borderRadius="md"
            borderLeft="4px solid"
            borderColor="red.500"
            w="100%"
            maxW="md"
            mx="auto"
          >
            <Text color="red.700" fontWeight="bold">
              Error
            </Text>
            <Text color="red.600">{error}</Text>
          </Box>
        ) : cars.length === 0 ? (
          <Text fontSize="lg" color="gray.500" textAlign="center">
            No cars available at the moment.
          </Text>
        ) : (
          <VStack gap={8} align="stretch">
            {Object.entries(groupedCars).map(([make, carsForMake], index) => (
              <Box key={make}>
                {index > 0 && (
                  <Box 
                    height="1px" 
                    bg="gray.200" 
                    my={4} 
                    width="100%" 
                  />
                )}
                
                <Box mb={4}>
                  <Heading size="md" color="blue.600" mb={2}>
                    {capitalizeString(make)}
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    {carsForMake.length} {carsForMake.length === 1 ? 'car' : 'cars'} available
                  </Text>
                </Box>
                
                <CarGrid cars={carsForMake} onCarClick={handleCarClick} />
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}