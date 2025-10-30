import { Box, Button, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/api-client";
import { useUser } from "../context/UserContext";


const RESPONSIVE_WIDTHS = {
  container: { base: "95%", md: "500px" },
  maxWidth: "md"
};

const MESSAGE_STYLES = {
  backgrounds: { success: "green.100", error: "red.100", info: "blue.100" },
  borderColors: { success: "green.500", error: "red.500", info: "blue.500" },
  textColors: { success: "green.700", error: "red.700", info: "blue.700" }
};

const FORM_STYLING = {
  inputSize: "lg" as const,
  buttonSize: "lg" as const,
  containerPadding: 8,
  borderRadius: "md" as const
};

const LAYOUT_SPACING = {
  containerPadding: 16,
  formGap: 4,
  sectionGap: 8,
  buttonMarginTop: 4
};

const NAVIGATION_CONFIG = {
  redirectDelay: 1000,
  defaultRedirect: "/profile"
};

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
    setMessage(null);

    try {
      const response = await authService.login(formData);

      if (response.data.message === "Login successful") {
        login({
          user: response.data.user,
          token: response.data.token
        });

        setMessage({
          type: "success",
          text: `Welcome back, ${response.data.user.name}!`,
        });

        // Get redirect URL from query params or default to profile
        const redirectTo = searchParams.get("redirect") || NAVIGATION_CONFIG.defaultRedirect;

        setTimeout(() => {
          navigate(redirectTo);
        }, NAVIGATION_CONFIG.redirectDelay);
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
    <Box minH="90vh" bg="gray.50" display="flex" flexDirection="column">
      <Box maxW={RESPONSIVE_WIDTHS.maxWidth} mx="auto" py={LAYOUT_SPACING.containerPadding} px={4} flex="1" display="flex" alignItems="center">
        <VStack gap={LAYOUT_SPACING.sectionGap} align="center" w="100%">
          <Heading size="4xl" textAlign="center" color="gray.700">
            Login
          </Heading>

          <Box w={RESPONSIVE_WIDTHS.container} bg="white" p={FORM_STYLING.containerPadding} borderRadius={FORM_STYLING.borderRadius} boxShadow="sm">
            {message && (
              <Box
                p={4}
                mb={4}
                borderRadius={FORM_STYLING.borderRadius}
                bg={MESSAGE_STYLES.backgrounds[message.type]}
                borderLeft="4px solid"
                borderColor={MESSAGE_STYLES.borderColors[message.type]}
              >
                <Text
                  color={MESSAGE_STYLES.textColors[message.type]}
                  fontWeight="bold"
                >
                  {message.text}
                </Text>
              </Box>
            )}

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
