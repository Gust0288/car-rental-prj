import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <Container maxW="md" py={8}>
      <VStack gap={6}>
        <Box 
          p={12} 
          w="100%" 
          textAlign="center" 
          borderWidth={1} 
          borderRadius="lg" 
          shadow="md"
          bg="white"
        >
          <VStack gap={4}>
            <Heading size="lg" color="blue.600">
              Welcome, {user.name}!
            </Heading>
            
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={2}>
                Profile Information
              </Text>
              <VStack gap={2} align="start">
                <Text><strong>Name:</strong> {user.name}</Text>
                <Text><strong>Username:</strong> {user.username}</Text>
                <Text><strong>Email:</strong> {user.email}</Text>
              </VStack>
            </Box>

            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleLogout}
              size="lg"
              w="100%"
            >
              Logout
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default ProfilePage