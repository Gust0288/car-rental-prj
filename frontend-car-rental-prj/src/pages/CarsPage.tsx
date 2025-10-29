import { useEffect, useState } from "react";
import { 
  Box, 
  Heading, 
  Spinner, 
  Text, 
  Container, 
  VStack, 
  HStack,
  Stack
} from "@chakra-ui/react";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react/native-select";
import { Checkbox } from "@chakra-ui/react/checkbox";
import { getCars } from "../services/cars";
import type { Car } from "../services/cars";
import { CarGrid } from "../components/CarGrid";
import { getBookedCarIds } from "../services/bookings";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedCarIds, setBookedCarIds] = useState<number[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("all");
  const [hideBooked, setHideBooked] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      getCars(),
      getBookedCarIds()
    ])
      .then(([carsData, bookedIds]) => {
        console.log("Cars loaded:", carsData.length);
        console.log("Booked car IDs:", bookedIds);
        setCars(carsData);
        setBookedCarIds(bookedIds);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError(
          "Failed to load cars. Please make sure the backend server is running."
        );
      })
      .finally(() => setLoading(false));
  }, []);


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

  // Apply filters
  const applyFilters = (cars: Car[]) => {
    let filtered = [...cars];

    // Filter by make
    if (selectedMake !== "all") {
      filtered = filtered.filter(car => car.make === selectedMake);
    }

    // Filter out booked cars
    if (hideBooked) {
      console.log("Hiding booked cars. Booked IDs:", bookedCarIds);
      console.log("Before filter:", filtered.length);
      filtered = filtered.filter(car => !bookedCarIds.includes(car.id));
      console.log("After filter:", filtered.length);
    }

    return filtered;
  };

  const uniqueCars = removeDuplicateCars(cars);
  const filteredCars = applyFilters(uniqueCars);
  const groupedCars = groupCarsByMake(filteredCars);

  // Get unique makes for the dropdown
  const uniqueMakes = [...new Set(uniqueCars.map(car => car.make))].sort();

  return (
    <Box p={6}>
      <Container maxW="7xl">
        <Heading size="lg" mb={6} textAlign="center">
          All Available Cars
        </Heading>

        {/* Filter Controls */}
        <Box 
          mb={6} 
          p={4} 
          bg="gray.50" 
          borderRadius="md" 
          border="1px solid"
          borderColor="gray.200"
        >
          <Stack gap={4}>
            {/* Make Filter */}
            <Box>
              <Text mb={2} fontWeight="medium" fontSize="sm">
                Filter by Make
              </Text>
              <NativeSelectRoot>
                <NativeSelectField 
                  value={selectedMake} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMake(e.target.value)}
                  bg="white"
                  borderColor="gray.300"
                >
                  <option value="all">All Makes</option>
                  {uniqueMakes.map(make => (
                    <option key={make} value={make}>
                      {capitalizeString(make)}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Box>

            {/* Hide Booked Toggle */}
            <HStack justify="space-between">
              <Checkbox.Root
                checked={hideBooked}
                onCheckedChange={(e) => {
                  console.log("Checkbox changed:", e.checked);
                  setHideBooked(!!e.checked);
                }}
                size="lg"
                colorPalette="blue"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label fontWeight="medium" fontSize="sm">
                  Hide Booked Cars
                </Checkbox.Label>
              </Checkbox.Root>
            </HStack>
          </Stack>

          {/* Results count */}
          <Text mt={3} fontSize="sm" color="gray.600">
            Showing {filteredCars.length} of {uniqueCars.length} cars
            {hideBooked && bookedCarIds.length > 0 && (
              <Text as="span" ml={2} color="blue.600">
                ({bookedCarIds.length} currently booked)
              </Text>
            )}
          </Text>
        </Box>

        
        
        
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
                
                <CarGrid cars={carsForMake}/>
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}