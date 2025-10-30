import { Box, HStack, VStack, Text, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  
  const isActivePath = (path: string) => {
    return location.pathname === path;
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

        <HStack gap={2}>
          <Button
            variant={isActivePath("/") ? "solid" : "ghost"}
            size="sm"
            color={isActivePath("/") ? "blue.500" : "white"}
            bg={isActivePath("/") ? "white" : "transparent"}
            _hover={{ bg: isActivePath("/") ? "gray.100" : "blue.600" }}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            variant={isActivePath("/cars") ? "solid" : "ghost"}
            size="sm"
            color={isActivePath("/cars") ? "blue.500" : "white"}
            bg={isActivePath("/cars") ? "white" : "transparent"}
            _hover={{ bg: isActivePath("/cars") ? "gray.100" : "blue.600" }}
            onClick={() => navigate("/cars")}
          >
            Cars
          </Button>
          <Button
            variant={isActivePath("/login") ? "solid" : "ghost"}
            size="sm"
            color={isActivePath("/login") ? "blue.500" : "white"}
            bg={isActivePath("/login") ? "white" : "transparent"}
            _hover={{ bg: isActivePath("/login") ? "gray.100" : "blue.600" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant={isActivePath("/signup") ? "solid" : "ghost"}
            size="sm"
            color={isActivePath("/signup") ? "blue.500" : "white"}
            bg={isActivePath("/signup") ? "white" : "transparent"}
            _hover={{ bg: isActivePath("/signup") ? "gray.100" : "blue.600" }}
            onClick={() => navigate("/signup")}
          >
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
          {isOpen ? "✕" : "☰"}
        </Button>
      </HStack>

      {/* Mobile Search and Menu */}
      <Box display={{ base: "block", md: "none" }} width="100%">
        {/* Mobile Search Bar */}
        <Box px={4} py={3} borderTop="1px" borderColor="blue.400">
          <Input placeholder="Search for cars..." width="100%" bg="white" />
        </Box>

        {/* Mobile Menu */}
        {isOpen && (
          <VStack
            bg="white"
            p={4}
            gap={3}
            width="100%"
            borderTop="1px"
            borderColor="gray.200"
          >
            <Button
              variant={isActivePath("/") ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => {
                navigate("/");
                handleToggle();
              }}
              width="100%"
              justifyContent="center"
              borderWidth="1px"
              _hover={{ bg: isActivePath("/") ? "blue.600" : "blue.50" }}
              size="md"
              fontSize="md"
              fontWeight="medium"
              py={3}
            >
              Home
            </Button>
            <Button
              variant={isActivePath("/cars") ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => {
                navigate("/cars");
                handleToggle();
              }}
              width="100%"
              justifyContent="center"
              borderWidth="1px"
              _hover={{ bg: isActivePath("/cars") ? "blue.600" : "blue.50" }}
              size="md"
              fontSize="md"
              fontWeight="medium"
              py={3}
            >
              Cars
            </Button>
            <Button
              variant={isActivePath("/login") ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => {
                navigate("/login");
                handleToggle();
              }}
              width="100%"
              justifyContent="center"
              borderWidth="1px"
              _hover={{ bg: isActivePath("/login") ? "blue.600" : "blue.50" }}
              size="md"
              fontSize="md"
              fontWeight="medium"
              py={3}
            >
              Login
            </Button>
            <Button
              variant={isActivePath("/signup") ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => {
                navigate("/signup");
                handleToggle();
              }}
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
