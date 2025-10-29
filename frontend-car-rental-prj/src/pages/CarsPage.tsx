import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Box, 
  Heading, 
  Spinner, 
  Text, 
  Container, 
  VStack, 
  HStack,
  Stack,
  Input,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react/native-select";
import { Checkbox } from "@chakra-ui/react/checkbox";
import { Field as ChakraField } from "@chakra-ui/react/field";
import { getCars } from "../services/cars";
import type { Car } from "../services/cars";
import { CarGrid } from "../components/CarGrid";
import { getBookedCarIds } from "../services/bookings";

export default function CarsPage() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedCarIds, setBookedCarIds] = useState<number[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("all");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all");
  const [selectedCylinders, setSelectedCylinders] = useState<string>("all");
  const [selectedDrive, setSelectedDrive] = useState<string>("all");
  const [showUnavailable, setShowUnavailable] = useState<boolean>(false);
  
  // Location and date/time filters - Initialize from URL params
  const [pickupLocation, setPickupLocation] = useState(searchParams.get("pickupLocation") || "");
  const [returnLocation, setReturnLocation] = useState(searchParams.get("returnLocation") || "");
  const [pickupAt, setPickupAt] = useState(
    searchParams.get("pickupAt") || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [returnAt, setReturnAt] = useState(
    searchParams.get("returnAt") || new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  // Check if rental details were provided from URL params (collapse by default if they were)
  const hasRentalDetailsFromUrl = searchParams.has("pickupLocation") && searchParams.has("pickupAt");
  const [isRentalDetailsExpanded, setIsRentalDetailsExpanded] = useState(!hasRentalDetailsFromUrl);
  const [isVehicleSpecsExpanded, setIsVehicleSpecsExpanded] = useState(true);

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

    // Filter by class
    if (selectedClass !== "all") {
      filtered = filtered.filter(car => car.class === selectedClass);
    }

    // Filter by transmission
    if (selectedTransmission !== "all") {
      filtered = filtered.filter(car => car.transmission === selectedTransmission);
    }

    // Filter by fuel type
    if (selectedFuelType !== "all") {
      filtered = filtered.filter(car => car.fuel_type === selectedFuelType);
    }

    // Filter by cylinders
    if (selectedCylinders !== "all") {
      filtered = filtered.filter(car => car.cylinders?.toString() === selectedCylinders);
    }

    // Filter by drive
    if (selectedDrive !== "all") {
      filtered = filtered.filter(car => car.drive === selectedDrive);
    }

    // Filter out booked cars (unless showUnavailable is true)
    if (!showUnavailable) {
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
  
  // Get unique classes for the dropdown
  const uniqueClasses = [...new Set(uniqueCars.map(car => car.class).filter(Boolean))].sort();

  // Get unique transmissions for the dropdown
  const uniqueTransmissions = [...new Set(uniqueCars.map(car => car.transmission).filter(Boolean))].sort();

  // Get unique fuel types for the dropdown
  const uniqueFuelTypes = [...new Set(uniqueCars.map(car => car.fuel_type).filter(Boolean))].sort();

  // Get unique cylinders for the dropdown
  const uniqueCylinders = [...new Set(uniqueCars.map(car => car.cylinders).filter(Boolean))].sort((a, b) => (a || 0) - (b || 0));

  // Get unique drives for the dropdown
  const uniqueDrives = [...new Set(uniqueCars.map(car => car.drive).filter(Boolean))].sort();

  return (
    <Box p={6}>
      <Container maxW="7xl">
        <Heading size="lg" mb={6} textAlign="center">
          Car Selection
        </Heading>

        {/* Filter Controls */}
        <Box 
          mb={8} 
          p={{ base: 4, md: 6 }}
          bg="white"
          borderRadius="xl" 
          border="1px solid"
          borderColor="gray.200"
          shadow="lg"
        >
          <Stack gap={6}>
            {/* Location and Date/Time Section */}
            <Box 
              p={{ base: 4, md: 5 }} 
              bg="gradient-to-br"
              bgGradient="linear(to-br, blue.50, blue.100)"
              borderRadius="lg" 
              border="2px solid" 
              borderColor="blue.200"
              shadow="sm"
            >
              <HStack 
                justify="space-between" 
                mb={isRentalDetailsExpanded ? 4 : 0}
                cursor="pointer"
                onClick={() => setIsRentalDetailsExpanded(!isRentalDetailsExpanded)}
                _hover={{ opacity: 0.8 }}
              >
                <Heading size="sm" color="blue.700">
                  Rental Details
                </Heading>
                <Text fontSize="2xl" color="blue.600">
                  {isRentalDetailsExpanded ? "−" : "+"}
                </Text>
              </HStack>
              
              {isRentalDetailsExpanded && (
                <Grid 
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} 
                  gap={{ base: 3, md: 4 }}
                >
                <GridItem>
                  <ChakraField.Root>
                    <ChakraField.Label>Pick up location</ChakraField.Label>
                    <NativeSelectRoot>
                      <NativeSelectField
                        placeholder="Any location"
                        value={pickupLocation}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPickupLocation(e.target.value)}
                        bg="white"
                      >
                        <option value="cph">Copenhagen</option>
                        <option value="aar">Aarhus</option>
                        <option value="odn">Odense</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </ChakraField.Root>
                </GridItem>

                <GridItem>
                  <ChakraField.Root>
                    <ChakraField.Label>Return location</ChakraField.Label>
                    <NativeSelectRoot>
                      <NativeSelectField
                        placeholder="Any location"
                        value={returnLocation}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReturnLocation(e.target.value)}
                        bg="white"
                      >
                        <option value="cph">Copenhagen</option>
                        <option value="aar">Aarhus</option>
                        <option value="odn">Odense</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </ChakraField.Root>
                </GridItem>

                <GridItem>
                  <ChakraField.Root>
                    <ChakraField.Label>Pick up date and time</ChakraField.Label>
                    <Input
                      type="datetime-local"
                      value={pickupAt}
                      onChange={(e) => setPickupAt(e.target.value)}
                      bg="white"
                    />
                  </ChakraField.Root>
                </GridItem>
                
                <GridItem>
                  <ChakraField.Root>
                    <ChakraField.Label>Return date and time</ChakraField.Label>
                    <Input
                      type="datetime-local"
                      value={returnAt}
                      onChange={(e) => setReturnAt(e.target.value)}
                      min={pickupAt}
                      bg="white"
                    />
                  </ChakraField.Root>
                </GridItem>
              </Grid>
              )}
            </Box>

            {/* Vehicle Specifications Section */}
            <Box>
              <HStack 
                justifyContent="space-between" 
                cursor="pointer" 
                onClick={() => setIsVehicleSpecsExpanded(!isVehicleSpecsExpanded)}
                mb={isVehicleSpecsExpanded ? 3 : 0}
                p={2}
                borderRadius="md"
                _hover={{ opacity: 0.7 }}
                transition="opacity 0.2s"
              >
                <Text fontWeight="bold" fontSize="lg" color="gray.700">
                  Vehicle Specifications
                </Text>
                <Text fontSize="xl" color="gray.600" fontWeight="bold">
                  {isVehicleSpecsExpanded ? "−" : "+"}
                </Text>
              </HStack>
              
              {isVehicleSpecsExpanded && (
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    sm: "repeat(2, 1fr)", 
                    md: "repeat(3, 1fr)",
                    lg: "repeat(3, 1fr)"
                  }} 
                  gap={{ base: 3, md: 4 }}
                >
                {/* Make Filter */}
                <GridItem>
                  <Text mb={2} fontWeight="semibold" fontSize="sm" color="gray.600">
                    Make
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField 
                      value={selectedMake} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMake(e.target.value)}
                      bg="white"
                      borderColor="gray.300"
                      borderRadius="md"
                      _hover={{ borderColor: "blue.400" }}
                      _focus={{ borderColor: "blue.500", shadow: "outline" }}
                    >
                      <option value="all">All Makes</option>
                      {uniqueMakes.map(make => (
                        <option key={make} value={make}>
                          {capitalizeString(make)}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </GridItem>

                {/* Class Filter */}
                <GridItem>
                  <Text mb={2} fontWeight="semibold" fontSize="sm" color="gray.600">
                    Class
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField 
                      value={selectedClass} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedClass(e.target.value)}
                      bg="white"
                      borderColor="gray.300"
                      borderRadius="md"
                      _hover={{ borderColor: "blue.400" }}
                      _focus={{ borderColor: "blue.500", shadow: "outline" }}
                    >
                      <option value="all">All Classes</option>
                      {uniqueClasses.map(carClass => (
                        <option key={carClass} value={carClass}>
                          {capitalizeString(carClass || '')}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </GridItem>

                {/* Transmission Filter */}
                <GridItem>
                  <Text mb={2} fontWeight="semibold" fontSize="sm" color="gray.600">
                    Transmission
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField 
                      value={selectedTransmission} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTransmission(e.target.value)}
                      bg="white"
                      borderColor="gray.300"
                      borderRadius="md"
                      _hover={{ borderColor: "blue.400" }}
                      _focus={{ borderColor: "blue.500", shadow: "outline" }}
                    >
                      <option value="all">All Transmissions</option>
                      {uniqueTransmissions.map(transmission => (
                        <option key={transmission} value={transmission}>
                          {capitalizeString(transmission || '')}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </GridItem>

                {/* Fuel Type Filter */}
                <GridItem>
                  <Text mb={2} fontWeight="semibold" fontSize="sm" color="gray.600">
                    Fuel Type
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField 
                      value={selectedFuelType} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedFuelType(e.target.value)}
                      bg="white"
                      borderColor="gray.300"
                      borderRadius="md"
                      _hover={{ borderColor: "blue.400" }}
                      _focus={{ borderColor: "blue.500", shadow: "outline" }}
                    >
                      <option value="all">All Fuel Types</option>
                      {uniqueFuelTypes.map(fuelType => (
                        <option key={fuelType} value={fuelType}>
                          {capitalizeString(fuelType || '')}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </GridItem>

                {/* Cylinders Filter */}
                <GridItem>
                  <Text mb={2} fontWeight="semibold" fontSize="sm" color="gray.600">
                    Cylinders
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField 
                      value={selectedCylinders} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCylinders(e.target.value)}
                      bg="white"
                      borderColor="gray.300"
                      borderRadius="md"
                      _hover={{ borderColor: "blue.400" }}
                      _focus={{ borderColor: "blue.500", shadow: "outline" }}
                    >
                      <option value="all">All Cylinders</option>
                      {uniqueCylinders.map(cylinders => (
                        <option key={cylinders} value={cylinders?.toString()}>
                          {cylinders} {cylinders === 1 ? 'cylinder' : 'cylinders'}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </GridItem>

                {/* Drive Filter */}
                <GridItem>
                  <Text mb={2} fontWeight="semibold" fontSize="sm" color="gray.600">
                    Drive
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField 
                      value={selectedDrive} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDrive(e.target.value)}
                      bg="white"
                      borderColor="gray.300"
                      borderRadius="md"
                      _hover={{ borderColor: "blue.400" }}
                      _focus={{ borderColor: "blue.500", shadow: "outline" }}
                    >
                      <option value="all">All Drive Types</option>
                      {uniqueDrives.map(drive => (
                        <option key={drive} value={drive}>
                          {drive?.toUpperCase()}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </GridItem>
              </Grid>
              )}
            </Box>

            {/* Divider */}
            <Box height="1px" bg="gray.200" my={2} />
          </Stack>

          {/* Results count and Hide Booked Toggle */}
          <Box 
            mt={4} 
            p={4} 
            bg="gray.50" 
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <HStack gap={4} flexWrap="wrap">
                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                  Showing <Text as="span" color="blue.600">{filteredCars.length}</Text> of {uniqueCars.length} cars
                </Text>
              </HStack>
              
              <Checkbox.Root
                checked={showUnavailable}
                onCheckedChange={(e) => {
                  console.log("Checkbox changed:", e.checked);
                  setShowUnavailable(!!e.checked);
                }}
                size="lg"
                colorPalette="blue"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label fontWeight="semibold" fontSize="md">
                  Show Booked Cars
                </Checkbox.Label>
              </Checkbox.Root>
            </HStack>
          </Box>
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