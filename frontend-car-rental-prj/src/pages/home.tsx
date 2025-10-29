import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  HStack,
  Input,
  Grid,
  GridItem,
  Stack,
} from "@chakra-ui/react";
import { Field as ChakraField } from "@chakra-ui/react/field";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react/native-select";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export default function Home() {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [pickupAt, setPickupAt] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [returnAt, setReturnAt] = useState(
    new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  const errors = {
    pickupLocation: pickupLocation ? "" : "Choose pick up location",
    returnLocation: returnLocation ? "" : "Choose return location",
    pickupAt: new Date(pickupAt).getTime() > Date.now() - 60 * 1000 ? "" : "Pick up must be in the future",
    returnAt: new Date(returnAt) > new Date(pickupAt) ? "" : "Return must be after pick up",
  };

  const handleSearch = () => {
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      return;
    }
    
    // Navigate to cars page with search params
    const params = new URLSearchParams({
      pickupLocation,
      returnLocation,
      pickupAt,
      returnAt,
    });
    navigate(`/cars?${params.toString()}`);
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
              <Stack gap={4}>
                <ChakraField.Root invalid={!!errors.pickupLocation}>
                  <ChakraField.Label>Pick up location</ChakraField.Label>
                  <NativeSelectRoot>
                    <NativeSelectField
                      placeholder="Select location"
                      value={pickupLocation}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPickupLocation(e.target.value)}
                    >
                      <option value="cph">Copenhagen</option>
                      <option value="aar">Aarhus</option>
                      <option value="odn">Odense</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                  {errors.pickupLocation && <ChakraField.ErrorText>{errors.pickupLocation}</ChakraField.ErrorText>}
                </ChakraField.Root>

                <ChakraField.Root invalid={!!errors.returnLocation}>
                  <ChakraField.Label>Return location</ChakraField.Label>
                  <NativeSelectRoot>
                    <NativeSelectField
                      placeholder="Select location"
                      value={returnLocation}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReturnLocation(e.target.value)}
                    >
                      <option value="cph">Copenhagen</option>
                      <option value="aar">Aarhus</option>
                      <option value="odn">Odense</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                  {errors.returnLocation && <ChakraField.ErrorText>{errors.returnLocation}</ChakraField.ErrorText>}
                </ChakraField.Root>

                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <GridItem>
                    <ChakraField.Root invalid={!!errors.pickupAt}>
                      <ChakraField.Label>Pick up date and time</ChakraField.Label>
                      <Input
                        type="datetime-local"
                        value={pickupAt}
                        onChange={(e) => setPickupAt(e.target.value)}
                      />
                      {errors.pickupAt && <ChakraField.ErrorText>{errors.pickupAt}</ChakraField.ErrorText>}
                    </ChakraField.Root>
                  </GridItem>
                  
                  <GridItem>
                    <ChakraField.Root invalid={!!errors.returnAt}>
                      <ChakraField.Label>Return date and time</ChakraField.Label>
                      <Input
                        type="datetime-local"
                        value={returnAt}
                        onChange={(e) => setReturnAt(e.target.value)}
                        min={pickupAt}
                      />
                      {errors.returnAt && <ChakraField.ErrorText>{errors.returnAt}</ChakraField.ErrorText>}
                    </ChakraField.Root>
                  </GridItem>
                </Grid>
              </Stack>
              
              <Box mt={6} textAlign="center">
                <Button
                  onClick={handleSearch}
                  variant="primary"
                  size="lg"
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
                size="lg"
              >
                Browse All Cars
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                size="lg"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="primary"
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