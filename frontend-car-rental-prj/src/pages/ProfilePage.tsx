import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  Flex,
  IconButton,
  Stack,
  Spinner,
} from '@chakra-ui/react'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@chakra-ui/react/dialog"
import { useEffect, useState } from 'react'
import { FiEdit3, FiCheck, FiX, FiUser, FiMail, FiAtSign, FiLogOut, FiTrash2 } from 'react-icons/fi'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api-client'
import { toaster, TOAST_DURATIONS } from '../utils/toaster'
import { RedirectingLoader } from '../components/RedirectingLoader'

// variables 
const RESPONSIVE_SIZES = {
  container: { base: "full", md: "4xl" },
  padding: { base: 4, md: 8 },
  spacing: { base: 6, md: 8 },
  inputSize: { base: "md", md: "lg" },
  borderRadius: { base: "lg", md: "xl" },
  avatar: { base: 16, md: 20 },
  fontSize: { base: "md", md: "lg" }
}

const COLORS = {
  gradient: "gradient(linear, to-r, blue.400, blue.600)",
  cardBg: "white",
  sectionBg: "gray.50",
  borderColor: "gray.200",
  focusBorder: "blue.400",
  darkGray: "#52525b"
}

const TOAST_MESSAGES = {
  updateSuccess: { 
    title: 'Profile updated', 
    description: 'Your profile has been successfully updated.', 
    type: 'success' as const,
    duration: TOAST_DURATIONS.short 
  },
  updateError: { 
    title: 'Update failed', 
    description: 'Failed to update profile. Please try again.', 
    type: 'error' as const,
    duration: TOAST_DURATIONS.short 
  },
  deleteSuccess: { 
    title: 'Account deleted', 
    description: 'Your account has been successfully deleted.', 
    type: 'success' as const,
    duration: TOAST_DURATIONS.short 
  },
  deleteError: { 
    title: 'Delete failed', 
    description: 'Failed to delete account. Please try again.', 
    type: 'error' as const,
    duration: TOAST_DURATIONS.short 
  }
}

const FORM_VALIDATION = {
  nameRequired: 'Name is required',
  usernameRequired: 'Username is required',
  emailRequired: 'Email is required',
  emailInvalid: 'Email is invalid',
  lastNameRequired: 'Last name is required'
}

const DIALOG_CONFIG = { maxW: "xs", mx: 4 }
const BORDER_STYLE = "1px solid"
const FOCUS_STYLES = { borderColor: 'blue.400', bg: 'white' }

interface ProfileFormData {
  username: string
  name: string
  user_last_name: string
  email: string
}

const ProfilePage = () => {
  const { user, logout, login } = useUser()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    username: user?.username || '',
    name: user?.name || '',
    user_last_name: user?.user_last_name || '',
    email: user?.email || ''
  })
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({})

  const handleLogout = () => {
    logout()
    setIsEditing(false)
    setErrors({})
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')

      if (!storedUser || !storedToken) {
        navigate('/login', { replace: true })
      }
    }
  }, [user, navigate])

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = FORM_VALIDATION.nameRequired
    }
    
    if (!formData.username.trim()) {
      newErrors.username = FORM_VALIDATION.usernameRequired
    }
    
    if (!formData.email.trim()) {
      newErrors.email = FORM_VALIDATION.emailRequired
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = FORM_VALIDATION.emailInvalid
    }
    
    if (!formData.user_last_name.trim()) {
      newErrors.user_last_name = FORM_VALIDATION.lastNameRequired
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !user) return
    
    setIsLoading(true)
    try {
      await authService.updateProfile(user.id, formData)
      
     
      const updatedUser = { ...user, ...formData }
      login({ user: updatedUser, token: localStorage.getItem('token') || '' })
      
      setIsEditing(false)
      toaster.create(TOAST_MESSAGES.updateSuccess)
    } catch {
      toaster.create(TOAST_MESSAGES.updateError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      name: user?.name || '',
      user_last_name: user?.user_last_name || '',
      email: user?.email || ''
    })
    setErrors({})
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      await authService.deleteAccount(user.id)
      
      toaster.create(TOAST_MESSAGES.deleteSuccess)
      
   
      logout()
      navigate('/')
    } catch {
      toaster.create(TOAST_MESSAGES.deleteError)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <RedirectingLoader />;
  }

  const getInitials = (name: string, lastName: string) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Container maxW={RESPONSIVE_SIZES.container} px={RESPONSIVE_SIZES.padding} py={RESPONSIVE_SIZES.padding}>
      <VStack gap={RESPONSIVE_SIZES.spacing}>
        {/* Header Section */}
        <Box 
          w="100%" 
          bg={COLORS.gradient}
          borderRadius={RESPONSIVE_SIZES.borderRadius}
          p={RESPONSIVE_SIZES.padding}
          color="white"
          shadow="xl"
        >
          <Flex 
            direction={{ base: "column", sm: "row" }}
            justify="space-between" 
            align="center"
            gap={{ base: 4, sm: 0 }}
          >
            <HStack gap={{ base: 4, md: 6 }}>
              <Box 
                w={RESPONSIVE_SIZES.avatar}
                h={RESPONSIVE_SIZES.avatar}
                bg="white" 
                borderRadius="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                fontSize={RESPONSIVE_SIZES.fontSize}
                fontWeight="bold"
                color="blue.600"
                shadow="md"
              >
                {getInitials(user.name, user.user_last_name)}
              </Box>
              <Box textAlign={{ base: "center", sm: "left" }}>
                
                <Heading 
                  size={{ base: "lg", md: "xl" }} 
                  fontWeight="bold"
                  color={COLORS.darkGray}
                  letterSpacing="tight"
                >
                  {user.name} {user.user_last_name}
                </Heading>
                <Text 
                  fontSize={{ base: "md", md: "lg" }} 
                  color={COLORS.darkGray}
                  fontWeight="semibold"
                  opacity={0.95}
                >
                  @{user.username}
                </Text>
              </Box>
            </HStack>
            
            <Box 
              bg="green.500" 
              px={{ base: 3, md: 4 }}
              py={2}
              borderRadius="full" 
              fontWeight="semibold"
              fontSize={{ base: "sm", md: "md" }}
            >
              Active Member
            </Box>
            
          </Flex>
        </Box>

    
        <Box 
          w="100%" 
          bg={COLORS.cardBg}
          borderRadius={RESPONSIVE_SIZES.borderRadius}
          shadow="lg" 
          p={RESPONSIVE_SIZES.padding}
          border={BORDER_STYLE}
          borderColor={COLORS.borderColor}
        >
          <Flex 
            direction={{ base: "column", sm: "row" }}
            justify="space-between" 
            align={{ base: "stretch", sm: "center" }}
            mb={6}
            gap={{ base: 4, sm: 0 }}
          >
            <Heading size={{ base: "md", md: "lg" }} color="gray.700">
              Profile Information
            </Heading>
            {!isEditing ? (
              <HStack gap={2} justifyContent={{ base: "flex-end", sm: "auto" }}>
                <IconButton
                  aria-label="Edit profile"
                  colorScheme="blue"
                  variant="ghost"
                  size={{ base: "md", md: "lg" }}
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit3 />
                </IconButton>
                
              
                <DialogRoot>
                  <DialogTrigger asChild>
                    <IconButton
                      aria-label="Delete account"
                      colorScheme="red"
                      variant="ghost"
                      size={{ base: "md", md: "lg" }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </DialogTrigger>

                  <DialogContent {...DIALOG_CONFIG}>
                    <DialogHeader pb={2}>
                      <DialogTitle fontSize="lg">Delete Account?</DialogTitle>
                      <DialogCloseTrigger />
                    </DialogHeader>

                    <DialogBody py={3}>
                      <Text color="gray.600" fontSize="sm">
                        This will permanently delete your account and all data. This action cannot be undone.
                      </Text>
                    </DialogBody>

                    <DialogFooter pt={2}>
                      <HStack gap={2} w="100%">
                        <DialogActionTrigger asChild>
                          <Button variant="outline" size="sm" flex={1}>
                            Cancel
                          </Button>
                        </DialogActionTrigger>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          flex={1}
                        >
                          {isLoading ? <Spinner size="xs" /> : "Delete"}
                        </Button>
                      </HStack>
                    </DialogFooter>
                  </DialogContent>
                </DialogRoot>
              </HStack>
            ) : (
              <HStack gap={2} justifyContent={{ base: "flex-end", sm: "auto" }}>
                <IconButton
                  aria-label="Save changes"
                  colorScheme="green"
                  onClick={handleSave}
                  disabled={isLoading}
                  size={{ base: "sm", md: "md" }}
                >
                  {isLoading ? <Spinner size="sm" /> : <FiCheck />}
                </IconButton>
                <IconButton
                  aria-label="Cancel editing"
                  colorScheme="red"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isLoading}
                  size={{ base: "sm", md: "md" }}
                >
                  <FiX />
                </IconButton>
              </HStack>
            )}
          </Flex>

          <Stack gap={6}>
            {isEditing ? (
              <VStack gap={6} align="stretch">
                <Stack direction={{ base: "column", md: "row" }} gap={4}>
                  <Box flex={1}>
                    <Text color="gray.700" fontWeight="semibold" mb={2}>
                      First Name
                    </Text>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your first name"
                      bg={COLORS.sectionBg}
                      border={BORDER_STYLE}
                      borderColor={COLORS.borderColor}
                      _focus={FOCUS_STYLES}
                      size={{ base: "md", md: "lg" }}
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.name}
                      </Text>
                    )}
                  </Box>
                  
                  <Box flex={1}>
                    <Text color="gray.700" fontWeight="semibold" mb={2}>
                      Last Name
                    </Text>
                    <Input
                      value={formData.user_last_name}
                      onChange={(e) => handleInputChange('user_last_name', e.target.value)}
                      placeholder="Enter your last name"
                      bg={COLORS.sectionBg}
                      border={BORDER_STYLE}
                      borderColor={COLORS.borderColor}
                      _focus={FOCUS_STYLES}
                      size={{ base: "md", md: "lg" }}
                    />
                    {errors.user_last_name && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.user_last_name}
                      </Text>
                    )}
                  </Box>
                </Stack>
                
                <Box>
                  <Text color="gray.700" fontWeight="semibold" mb={2}>
                    Username
                  </Text>
                  <Input
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter your username"
                    bg={COLORS.sectionBg}
                    border={BORDER_STYLE}
                    borderColor={COLORS.borderColor}
                    _focus={FOCUS_STYLES}
                    size={{ base: "md", md: "lg" }}
                  />
                  {errors.username && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.username}
                    </Text>
                  )}
                </Box>
                
                <Box>
                  <Text color="gray.700" fontWeight="semibold" mb={2}>
                    Email Address
                  </Text>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    bg={COLORS.sectionBg}
                    border={BORDER_STYLE}
                    borderColor={COLORS.borderColor}
                    _focus={FOCUS_STYLES}
                    size={{ base: "md", md: "lg" }}
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </Box>
              </VStack>
            ) : (
              <VStack gap={4} align="stretch">
                <Stack direction={{ base: "column", md: "row" }} gap={4}>
                  <Box 
                    flex={1} 
                    p={{ base: 4, md: 6 }}
                    bg="gray.50" 
                    borderRadius="lg" 
                    border="1px solid" 
                    borderColor="gray.200"
                  >
                    <HStack gap={3} mb={2}>
                      <FiUser color="gray.600" />
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Full Name
                      </Text>
                    </HStack>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="gray.800">
                      {user.name} {user.user_last_name}
                    </Text>
                  </Box>
                  
                  <Box 
                    flex={1} 
                    p={{ base: 4, md: 6 }}
                    bg="gray.50" 
                    borderRadius="lg" 
                    border="1px solid" 
                    borderColor="gray.200"
                  >
                    <HStack gap={3} mb={2}>
                      <FiAtSign color="gray.600" />
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Username
                      </Text>
                    </HStack>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="gray.800">
                      @{user.username}
                    </Text>
                  </Box>
                </Stack>
                
                <Stack direction={{ base: "column", md: "row" }} gap={4}>
                  <Box 
                    flex={1} 
                    p={{ base: 4, md: 6 }}
                    bg="gray.50" 
                    borderRadius="lg" 
                    border="1px solid" 
                    borderColor="gray.200"
                  >
                    <HStack gap={3} mb={2}>
                      <FiMail color="gray.600" />
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Email Address
                      </Text>
                    </HStack>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="gray.800">
                      {user.email}
                    </Text>
                  </Box>
                  
                  <Box 
                    flex={1} 
                    p={{ base: 4, md: 6 }}
                    bg="gray.50" 
                    borderRadius="lg" 
                    border="1px solid" 
                    borderColor="gray.200"
                  >
                    <HStack gap={3} mb={2}>
                      <FiUser color="gray.600" />
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Last Name
                      </Text>
                    </HStack>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="gray.800">
                      {user.user_last_name}
                    </Text>
                  </Box>
                </Stack>
              </VStack>
            )}
          </Stack>
        </Box>

       
        <Box 
          w="100%" 
          bg={COLORS.cardBg}
          borderRadius={RESPONSIVE_SIZES.borderRadius}
          shadow="lg" 
          p={RESPONSIVE_SIZES.padding}
          border={BORDER_STYLE}
          borderColor={COLORS.borderColor}
        >
          <VStack gap={4}>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleLogout}
              size={{ base: "md", md: "lg" }}
              w="100%"
              _hover={{ bg: 'red.50' }}
              borderWidth={2}
            >
              <HStack gap={2}>
                <FiLogOut />
                <Text>Sign Out</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default ProfilePage