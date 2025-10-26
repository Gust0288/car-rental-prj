import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  HStack,
  Button,
  Input,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({
    location: "",
    pickupDate: "",
    returnDate: "",
    carType: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    // For now, just navigate to cars page
    // Later you can pass search criteria as URL params or state
    console.log("Search criteria:", searchCriteria);
    navigate("/cars");
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="gradient-to-r"
        bgGradient="linear(to-r, blue.600, blue.400)"
        color="black"
        py={20}
        textAlign="center"
      >
        <Container maxW="6xl">
          <VStack gap={6}>
            <Heading size="2xl" fontWeight="bold">
              Find Your Perfect Rental Car
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Choose from hundreds of vehicles at unbeatable prices. 
              Your journey starts here.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Search Section */}
      <Box py={10} bg="gray.50">
        <Container maxW="4xl">
          <VStack gap={8}>
            <Heading size="lg" textAlign="center" color="gray.700">
              Search for Cars
            </Heading>
            
            <Box w="100%" bg="white" p={8} borderRadius="lg" shadow="md">
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                <GridItem>
                  <Text mb={2} fontWeight="semibold">
                    Pickup Location
                  </Text>
                  <Input
                    name="location"
                    placeholder="Enter city or airport"
                    value={searchCriteria.location}
                    onChange={handleInputChange}
                    size="lg"
                  />
                </GridItem>
                
                <GridItem>
                  <Text mb={2} fontWeight="semibold">
                    Car Type
                  </Text>
                  <Input
                    name="carType"
                    placeholder="Select car type (e.g., Economy, SUV, Luxury)"
                    value={searchCriteria.carType}
                    onChange={handleInputChange}
                    size="lg"
                  />
                </GridItem>
                
                <GridItem>
                  <Text mb={2} fontWeight="semibold">
                    Pickup Date
                  </Text>
                  <Input
                    name="pickupDate"
                    type="date"
                    value={searchCriteria.pickupDate}
                    onChange={handleInputChange}
                    size="lg"
                  />
                </GridItem>
                
                <GridItem>
                  <Text mb={2} fontWeight="semibold">
                    Return Date
                  </Text>
                  <Input
                    name="returnDate"
                    type="date"
                    value={searchCriteria.returnDate}
                    onChange={handleInputChange}
                    size="lg"
                  />
                </GridItem>
              </Grid>
              
              <Box mt={6} textAlign="center">
                <Button
                  onClick={handleSearch}
                  colorScheme="blue"
                  size="lg"
                  px={8}
                  py={3}
                >
                  Search Cars
                </Button>
              </Box>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Quick Links Section */}
      <Box py={16}>
        <Container maxW="6xl">
          <VStack gap={8}>
            <Heading size="lg" textAlign="center" color="gray.700">
              Quick Actions
            </Heading>
            
            <HStack gap={4} flexWrap="wrap" justify="center">
              <Button
                onClick={() => navigate("/cars")}
                variant="outline"
                colorScheme="blue"
                size="lg"
              >
                Browse All Cars
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                colorScheme="gray"
                size="lg"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                colorScheme="blue"
                size="lg"
              >
                Create Account
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}