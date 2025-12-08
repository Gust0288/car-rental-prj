import { Box, Button, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/api-client";
import { useUser } from "../context/UserContext";
import { toaster, TOAST_DURATIONS } from "../utils/toaster";
import { logger } from "../utils/logger";

const RESPONSIVE_WIDTHS = {
  container: { base: "95%", md: "500px" },
  maxWidth: "md",
};

const FORM_STYLING = {
  inputSize: "lg" as const,
  buttonSize: "lg" as const,
  containerPadding: 8,
  borderRadius: "md" as const,
};

const LAYOUT_SPACING = {
  containerPadding: 16,
  formGap: 4,
  sectionGap: 8,
  buttonMarginTop: 4,
};

const NAVIGATION_CONFIG = {
  redirectDelay: 1000,
  defaultRedirect: "/profile",
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
      logger.debug("Login attempt", { email: formData.email });
      const response = await authService.login(formData);

      if (response.data.message === "Login successful") {
        login({
          user: response.data.user,
          token: response.data.token,
        });

        toaster.create({
          title: "Login successful",
          description: `Welcome back, ${response.data.user.name}!`,
          type: "success",
          duration: TOAST_DURATIONS.short,
        });

        // Get redirect URL from query params or default to profile
        const redirectTo =
          searchParams.get("redirect") || NAVIGATION_CONFIG.defaultRedirect;
        logger.info("Login successful, redirecting", {
          email: formData.email,
          redirectTo,
        });

        // Navigate immediately so error messages stay visible when login fails
        navigate(redirectTo);
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong";

      if (error && typeof error === "object") {
        // Try to extract message from axios error structure
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;

        errorMessage =
          axiosError?.response?.data?.message ||
          axiosError?.response?.data?.error ||
          axiosError?.message ||
          "Something went wrong";
      }

      logger.error("Login failed", error, {
        email: formData.email,
        errorMessage,
      });

      toaster.create({
        title: "Login failed",
        description: errorMessage,
        type: "error",
        duration: TOAST_DURATIONS.short,
      });
      // clear only the password so the user doesn't have to retype email
      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="90vh" bg="gray.50" display="flex" flexDirection="column">
      <Box
        maxW={RESPONSIVE_WIDTHS.maxWidth}
        mx="auto"
        py={LAYOUT_SPACING.containerPadding}
        px={4}
        flex="1"
        display="flex"
        alignItems="center"
      >
        <VStack gap={LAYOUT_SPACING.sectionGap} align="center" w="100%">
          <Heading size="4xl" textAlign="center" color="gray.700">
            Login
          </Heading>

          <Box
            w={RESPONSIVE_WIDTHS.container}
            bg="white"
            p={FORM_STYLING.containerPadding}
            borderRadius={FORM_STYLING.borderRadius}
            boxShadow="sm"
          >
            <form onSubmit={handleSubmit}>
              <VStack gap={LAYOUT_SPACING.formGap} align="stretch">
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
                    size={FORM_STYLING.inputSize}
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
                    size={FORM_STYLING.inputSize}
                    required
                  />
                </Box>

                <Button
                  type="submit"
                  colorPalette="gray"
                  size={FORM_STYLING.buttonSize}
                  w="full"
                  loading={isLoading}
                  mt={LAYOUT_SPACING.buttonMarginTop}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;
