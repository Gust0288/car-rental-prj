import {  Box,  Button,  Heading,  Input,  VStack,  HStack,  Flex,  Text,} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );

      if (response.data.success) {
        // Store user data in context
        login(response.data.user);

        setMessage({
          type: "success",
          text: `Welcome back, ${response.data.user.name}!`,
        });

        // Redirect to profile page after a delay
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage =
          axiosError.response?.data?.message || "Something went wrong";
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      {/* Navigation Bar */}
      <Flex
        as="nav"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        px={8}
        py={4}
        justify="space-between"
        align="center"
      >
        <HStack gap={4}>
          <Box
            w={12}
            h={12}
            borderRadius="full"
            border="2px"
            borderColor="gray.300"
          />
        </HStack>

        <HStack gap={4}>
          <Button variant="outline" colorPalette="blue" size="md" asChild>
            <Link to="/signup">Signup</Link>
          </Button>
          <Button variant="solid" colorPalette="gray" size="md">
            Login
          </Button>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box maxW="md" mx="auto" py={16} px={4} flex="1" display="flex" alignItems="center">
        <VStack gap={8} align="center" w="100%">
          <Heading size="4xl" textAlign="center" color="gray.700">
            Login
          </Heading>

          <Box w="full" bg="white" p={8} borderRadius="md" boxShadow="sm">
            {message && (
              <Box
                p={4}
                mb={4}
                borderRadius="md"
                bg={
                  message.type === "success"
                    ? "green.100"
                    : message.type === "error"
                    ? "red.100"
                    : "blue.100"
                }
                borderLeft="4px solid"
                borderColor={
                  message.type === "success"
                    ? "green.500"
                    : message.type === "error"
                    ? "red.500"
                    : "blue.500"
                }
              >
                <Text
                  color={
                    message.type === "success"
                      ? "green.700"
                      : message.type === "error"
                      ? "red.700"
                      : "blue.700"
                  }
                  fontWeight="bold"
                >
                  {message.text}
                </Text>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text mb={2} fontWeight="semibold">
                    Email
                  </Text>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    size="lg"
                    required
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="semibold">
                    Password
                  </Text>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    size="lg"
                    required
                  />
                </Box>

                <Button
                  type="submit"
                  colorPalette="gray"
                  size="lg"
                  w="full"
                  loading={isLoading}
                  mt={4}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        bg="gray.800"
        color="white"
        py={8}
      >
        <Box maxW="container.xl" mx="auto" px={6}>
          <VStack gap={4} textAlign="center">
            <HStack justify="center" gap={8}>
              <Text fontSize="sm" color="gray.300">© 2025 Car Rental System</Text>
              <Text fontSize="sm" color="gray.300">•</Text>
              <Text fontSize="sm" color="gray.300" _hover={{ color: "blue.300", cursor: "pointer" }}>
                Privacy Policy
              </Text>
              <Text fontSize="sm" color="gray.300">•</Text>
              <Text fontSize="sm" color="gray.300" _hover={{ color: "blue.300", cursor: "pointer" }}>
                Terms of Service
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.400">
              Experience the best car rental service with us 🚗
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
