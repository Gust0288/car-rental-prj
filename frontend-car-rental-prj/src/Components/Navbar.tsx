import { HStack, Button, Text, Input } from "@chakra-ui/react";


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

      <HStack gap={4}>
        <Text fontSize="xl" fontWeight="bold" color="blue.500" whiteSpace="nowrap">
          Car Rental
        </Text>
      </HStack>

      <Input width="100%" placeholder="Search for cars..." mx={10} />

      <HStack gap={4}>
        <Button variant="ghost">Home</Button>
        <Button variant="ghost">Cars</Button>
        <Button variant="ghost">Login</Button>
        <Button colorScheme="blue">Sign Up</Button>
      </HStack>
    </HStack>
  );
};
