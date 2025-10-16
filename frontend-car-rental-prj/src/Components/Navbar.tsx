import { 
  Box, 
  HStack, 
  VStack, 
  Text, 
  Button,
  Input
} from "@chakra-ui/react";
import { useState } from "react";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      bg="blue.500"
      borderBottom="1px"
      borderColor="gray.200"
      shadow="sm"
      minH="60px"
      p={4}
    >
      {/* Desktop Navigation */}
      <HStack 
        justifyContent="space-between" 
        width="100%"
        maxW="1200px"
        mx="auto"
        display={{ base: "none", md: "flex" }}
      >
        <Text fontSize="xl" fontWeight="bold" color="white">
          Car Rental
        </Text>
        
        <Input 
          placeholder="Search for cars..." 
          width="100%"
          maxW="400px"
          mx={4}
          bg="white"
        />
        
        <HStack spacing={2}>
          <Button variant="ghost" size="sm" color="white" _hover={{ bg: "blue.600" }}>
            Home
          </Button>
          <Button variant="ghost" size="sm" color="white" _hover={{ bg: "blue.600" }}>
            Cars
          </Button>
          <Button variant="ghost" size="sm" color="white" _hover={{ bg: "blue.600" }}>
            Login
          </Button>
          <Button variant="solid" size="sm" bg="white" color="blue.500" _hover={{ bg: "gray.100" }}>
            Sign Up
          </Button>
        </HStack>
      </HStack>

      {/* Mobile Navigation */}
      <HStack 
        justifyContent="space-between" 
        width="100%"
        display={{ base: "flex", md: "none" }}
      >
        <Text fontSize="lg" fontWeight="bold" color="white">
          Car Rental
        </Text>
        
        <Button
          onClick={handleToggle}
          bg="white"
          color="blue.500"
          size="sm"
          _hover={{ bg: "gray.100" }}
        >
          {isOpen ? '✕' : '☰'}
        </Button>
      </HStack>

      {/* Mobile Search and Menu */}
      <Box display={{ base: "block", md: "none" }} width="100%">
        {/* Mobile Search Bar */}
        <Box px={4} py={3} borderTop="1px" borderColor="blue.400">
          <Input 
            placeholder="Search for cars..." 
            width="100%"
            bg="white"
          />
        </Box>

        {/* Mobile Menu */}
        {isOpen && (
          <VStack 
            bg="white" 
            p={4} 
            spacing={3}
            width="100%"
            borderTop="1px"
            borderColor="gray.200"
          >
            <Button 
              variant="outline" 
              colorScheme="blue" 
              onClick={handleToggle}
              width="100%"
              justifyContent="center"
              borderWidth="1px"
              _hover={{ bg: "blue.50" }}
              size="md"
              fontSize="md"
              fontWeight="medium"
              py={3}
            >
              Home
            </Button>
            <Button 
              variant="outline" 
              colorScheme="blue" 
              onClick={handleToggle}
              width="100%"
              justifyContent="center"
              borderWidth="1px"
              _hover={{ bg: "blue.50" }}
              size="md"
              fontSize="md"
              fontWeight="medium"
              py={3}
            >
              Cars
            </Button>
            <Button 
              variant="outline" 
              colorScheme="blue" 
              onClick={handleToggle}
              width="100%"
              justifyContent="center"
              borderWidth="1px"
              _hover={{ bg: "blue.50" }}
              size="md"
              fontSize="md"
              fontWeight="medium"
              py={3}
            >
              Login
            </Button>
            <Button 
              variant="solid" 
              colorScheme="blue" 
              onClick={handleToggle}
              width="100%"
              size="md"
              fontSize="md"
              fontWeight="semibold"
              py={3}
            >
              Sign Up
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
};
