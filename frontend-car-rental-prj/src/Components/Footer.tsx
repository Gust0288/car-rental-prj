import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export const Footer = () => {
  return (
    <Box bg="gray.50" color="gray.700" mt="5">
      <Box height="1px" bg="gray.200" width="100%" />
      <Container maxW="7xl" py={10}>
        <Stack gap={8}>
        <Stack gap={8}>
          {/* Main Footer Content */}
          <Stack direction={{ base: "column", md: "row" }} gap={8} justify="space-between">
          <Stack direction={{ base: "column", md: "row" }} gap={8} justify="space-between">
            {/* Company Info */}
            <VStack align="start" maxW="300px" gap={3}>
              <Text fontSize="xl" fontWeight="bold" color="blue.500">
                Car Rental
              </Text>
              <Text fontSize="sm">
                Your trusted partner for reliable and affordable car rentals. 
                Explore the world with our premium fleet of vehicles.
              </Text>
              <HStack gap={3}>
                <IconButton
                  aria-label="Facebook"
                  size="sm"
                  variant="ghost"
                  color="blue.500"
                  _hover={{ bg: "blue.50" }}
                >
                  <FaFacebook />
                </IconButton>
                <IconButton
                  aria-label="Twitter"
                  size="sm"
                  variant="ghost"
                  color="blue.500"
                  _hover={{ bg: "blue.50" }}
                >
                  <FaTwitter />
                </IconButton>
                <IconButton
                  aria-label="Instagram"
                  size="sm"
                  variant="ghost"
                  color="blue.500"
                  _hover={{ bg: "blue.50" }}
                >
                  <FaInstagram />
                </IconButton>
                <IconButton
                  aria-label="LinkedIn"
                  size="sm"
                  variant="ghost"
                  color="blue.500"
                  _hover={{ bg: "blue.50" }}
                >
                  <FaLinkedin />
                </IconButton>
              </HStack>
            </VStack>

            {/* Quick Links */}
            <VStack align="start" gap={3}>
            <VStack align="start" gap={3}>
              <Text fontWeight="bold" fontSize="md">
                Quick Links
              </Text>
              <Stack gap={2}>
              <Stack gap={2}>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Home
                </Link>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Our Fleet
                </Link>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Booking
                </Link>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  About Us
                </Link>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Contact
                </Link>
              </Stack>
            </VStack>

            {/* Services */}
            <VStack align="start" gap={3}>
            <VStack align="start" gap={3}>
              <Text fontWeight="bold" fontSize="md">
                Services
              </Text>
              <Stack gap={2}>
              <Stack gap={2}>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Car Rental
                </Link>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Long-term Rental
                </Link>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Corporate Rentals
                </Link>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Airport Pickup
                </Link>
                <Link href="#" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  24/7 Support
                </Link>
              </Stack>
            </VStack>

            {/* Contact Info */}
            <VStack align="start" gap={3}>
            <VStack align="start" gap={3}>
              <Text fontWeight="bold" fontSize="md">
                Contact Us
              </Text>
              <Stack gap={2}>
                <HStack gap={3}>
              <Stack gap={2}>
                <HStack gap={3}>
                  <FaPhone size={14} />
                  <Text fontSize="sm">+45 12 34 56 78</Text>
                </HStack>
                <HStack gap={3}>
                <HStack gap={3}>
                  <FaEnvelope size={14} />
                  <Text fontSize="sm">info@carrental.dk</Text>
                </HStack>
                <HStack gap={3} align="start">
                <HStack gap={3} align="start">
                  <FaMapMarkerAlt size={14} style={{ margin: 2 }} />
                  <Text fontSize="sm">
                    123 Copenhagen Street<br />
                    2100 Copenhagen, Denmark
                  </Text>
                </HStack>
              </Stack>
            </VStack>
          </Stack>

          <Box height="1px" bg="gray.200" width="100%" marginY={4} />

          {/* Bottom Section */}
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={4}
            justify="space-between"
            align="center"
          >
            <Text fontSize="sm">
              © 2025 Car Rental. All rights reserved.
            </Text>
            <HStack gap={6}>
            <HStack gap={6}>
              <Link href="#" fontSize="sm" color="blue.500" _hover={{ textDecoration: "underline" }}>
                Privacy Policy
              </Link>
              <Link href="#" fontSize="sm" color="blue.500" _hover={{ textDecoration: "underline" }}>
                Terms of Service
              </Link>
              <Link href="#" fontSize="sm" color="blue.500" _hover={{ textDecoration: "underline" }}>
                Cookie Policy
              </Link>
            </HStack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};