import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { httpClient } from '../services/httpClient'

// variables
const CONTAINER_LAYOUT = {
  maxWidth: "7xl",
  containerWidth: { base: "95%", md: "500px" },
  padding: { container: 10, form: 12 },
  spacing: { sections: 8, form: 6 }
};

const FORM_CONFIG = {
  inputSize: "lg" as const,
  buttonSize: "lg" as const,
  borderRadius: "md" as const,
  buttonMarginTop: 4
};

const MESSAGE_THEME = {
  success: { bg: "green.100", border: "green.500", text: "green.700" },
  error: { bg: "red.100", border: "red.500", text: "red.700" }
};

const SIGNUP_FLOW = {
  redirectDelay: 2000,
  redirectTarget: "/login",
  successMessage: "Account created successfully! Please login with your credentials."
};

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    user_last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await httpClient.post('/users/signup', formData)
      
      if (response.data.message === 'User created successfully') {
        
        setMessage({
          type: 'success',
          text: SIGNUP_FLOW.successMessage
        })
        
        setTimeout(() => {
          navigate(SIGNUP_FLOW.redirectTarget)
        }, SIGNUP_FLOW.redirectDelay)
      }
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong'
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        errorMessage = axiosError.response?.data?.message || 'Something went wrong'
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      {/* Main Content */}
    
      <Box maxW={CONTAINER_LAYOUT.maxWidth} mx="auto" py={CONTAINER_LAYOUT.padding.container} px={4} flex="1" display="flex" alignItems="center">
        <VStack gap={CONTAINER_LAYOUT.spacing.sections} align="center" w="100%">
          <Heading size="4xl" textAlign="center" color="gray.700">
            Sign up
          </Heading>

          <Box w={CONTAINER_LAYOUT.containerWidth} bg="white" p={CONTAINER_LAYOUT.padding.form} borderRadius={FORM_CONFIG.borderRadius} boxShadow="sm">
            {message && (
              <Box
                p={4}
                mb={4}
                borderRadius={FORM_CONFIG.borderRadius}
                bg={MESSAGE_THEME[message.type].bg}
                borderLeft="4px solid"
                borderColor={MESSAGE_THEME[message.type].border}
              >
                <Text
                  color={MESSAGE_THEME[message.type].text}
                  fontWeight="bold"
                >
                  {message.text}
                </Text>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <VStack gap={CONTAINER_LAYOUT.spacing.form} align="stretch" w="100%">
                <Box w="100%">
                  <Text mb={2} fontWeight="semibold">Username</Text>
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
                  <Text mb={2} fontWeight="semibold">Name</Text>
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
                  <Text mb={2} fontWeight="semibold">Last Name</Text>
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
                  <Text mb={2} fontWeight="semibold">Email</Text>
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
                  <Text mb={2} fontWeight="semibold">Password</Text>
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
                  <Text mb={2} fontWeight="semibold">Confirm Password</Text>
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
                  {isLoading ? 'Creating account...' : 'signup'}
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}

export default SignupPage