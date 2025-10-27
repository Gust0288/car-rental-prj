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
        // Don't auto-login - let user choose to login themselves
        setMessage({
          type: 'success',
          text: `Account created successfully! Please login with your credentials.`
        })
        
        // Redirect to login page after showing success message
        setTimeout(() => {
          navigate('/login')
        }, 2000)
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
    
      <Box maxW="7xl" mx="auto" py={10} px={4} flex="1" display="flex" alignItems="center">
        <VStack gap={8} align="center" w="100%">
          <Heading size="4xl" textAlign="center" color="gray.700">
            Sign up
          </Heading>

          <Box w={{ base: "95%", md: "500px" }} bg="white" p={12} borderRadius="md" boxShadow="sm">
            {message && (
              <Box
                p={4}
                mb={4}
                borderRadius="md"
                bg={message.type === 'success' ? 'green.100' : 'red.100'}
                borderLeft="4px solid"
                borderColor={message.type === 'success' ? 'green.500' : 'red.500'}
              >
                <Text
                  color={message.type === 'success' ? 'green.700' : 'red.700'}
                  fontWeight="bold"
                >
                  {message.text}
                </Text>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <VStack gap={6} align="stretch" w="100%">
                <Box w="100%">
                  <Text mb={2} fontWeight="semibold">Username</Text>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    size="lg"
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
                    size="lg"
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
                    size="lg"
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
                    size="lg"
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
                    size="lg"
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