import { HStack, Image, Button, Text, Spacer } from "@chakra-ui/react";
import logo from "../assets/logo.webp";

export const NavBar = () => {
  return (
    <HStack 
      justifyContent="space-between" 
      padding={4}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      shadow="sm"
    >

      <HStack spacing={4}>
        <Image src={logo} boxSize="60px" />
        <Text fontSize="xl" fontWeight="bold" color="blue.500">
          Car Rental
        </Text>
      </HStack>

      <Spacer />

      <HStack spacing={4}>
        <Button variant="ghost">Home</Button>
        <Button variant="ghost">Cars</Button>
        <Button variant="ghost">Login</Button>
        <Button colorScheme="blue">Sign Up</Button>
      </HStack>
    </HStack>
  );
};
