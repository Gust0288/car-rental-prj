import { Box, Button, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../services/httpClient";
import { toaster, TOAST_DURATIONS } from "../utils/toaster";
import { logger } from "../utils/logger";

// variables
const CONTAINER_LAYOUT = {
  maxWidth: "7xl",
  containerWidth: { base: "95%", md: "500px" },
  padding: { container: 10, form: 12 },
  spacing: { sections: 8, form: 6 },
};

const FORM_CONFIG = {
  inputSize: "lg" as const,
  buttonSize: "lg" as const,
  borderRadius: "md" as const,
  buttonMarginTop: 4,
};

const SIGNUP_FLOW = {
  redirectDelay: 2000,
  redirectTarget: "/login",
  successMessage:
    "Account created successfully! Please login with your credentials.",
};

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    user_last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      logger.debug("Signup attempt", {
        email: formData.email,
        username: formData.username,
      });
      const response = await httpClient.post("/users/signup", formData);

      if (response.data.message === "User created successfully") {
        logger.info("Signup successful", {
          email: formData.email,
          username: formData.username,
        });

        toaster.create({
          title: "Account created successfully",
          description: "Please login with your credentials.",
          type: "success",
          duration: TOAST_DURATIONS.short,
        });

        setTimeout(() => {
          navigate(SIGNUP_FLOW.redirectTarget);
        }, SIGNUP_FLOW.redirectDelay);
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong";

      if (error && typeof error === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;

        errorMessage =
          axiosError?.response?.data?.message ||
          axiosError?.response?.data?.error ||
          axiosError?.message ||
          "Something went wrong";
      }

      logger.error("Signup failed", error, {
        email: formData.email,
        username: formData.username,
        errorMessage,
      });

      toaster.create({
        title: "Signup failed",
        description: errorMessage,
        type: "error",
        duration: TOAST_DURATIONS.short,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      {/* Main Content */}

      <Box
        maxW={CONTAINER_LAYOUT.maxWidth}
        mx="auto"
        py={CONTAINER_LAYOUT.padding.container}
        px={4}
        flex="1"
        display="flex"
        alignItems="center"
      >
        <VStack gap={CONTAINER_LAYOUT.spacing.sections} align="center" w="100%">
          <Heading size="4xl" textAlign="center" color="gray.700">
            Sign up
          </Heading>

          <Box
            w={CONTAINER_LAYOUT.containerWidth}
            bg="white"
            p={CONTAINER_LAYOUT.padding.form}
            borderRadius={FORM_CONFIG.borderRadius}
            boxShadow="sm"
          >
            <form onSubmit={handleSubmit}>
              <VStack
                gap={CONTAINER_LAYOUT.spacing.form}
                align="stretch"
                w="100%"
              >
                <Box w="100%">
                  <Text mb={2} fontWeight="semibold">
                    Username
                  </Text>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    size={FORM_CONFIG.inputSize}
                    w="100%"
                    required
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="semibold">
                    Name
                  </Text>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    size={FORM_CONFIG.inputSize}
                    required
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="semibold">
                    Last Name
                  </Text>
                  <Input
                    name="user_last_name"
                    type="text"
                    placeholder="Last Name"
                    value={formData.user_last_name}
                    onChange={handleInputChange}
                    size={FORM_CONFIG.inputSize}
                    required
                  />
                </Box>

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
                    size={FORM_CONFIG.inputSize}
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
                    size={FORM_CONFIG.inputSize}
                    required
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="semibold">
                    Confirm Password
                  </Text>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    size={FORM_CONFIG.inputSize}
                    required
                  />
                </Box>

                <Button
                  type="submit"
                  colorPalette="gray"
                  size={FORM_CONFIG.buttonSize}
                  w="full"
                  loading={isLoading}
                  mt={FORM_CONFIG.buttonMarginTop}
                >
                  {isLoading ? "Creating account..." : "signup"}
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default SignupPage;
