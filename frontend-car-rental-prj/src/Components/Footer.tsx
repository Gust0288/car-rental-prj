import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export const Footer = () => {
  return (
    <Box bg="gray.50" color="gray.700" mt="5">
      <Box height="1px" bg="gray.200" width="100%" />
      <Container maxW="7xl" py={10}>
        <Stack spacing={8}>
          {/* Main Footer Content */}
          <Stack direction={{ base: "column", md: "row" }} spacing={8} justify="space-between">
            {/* Company Info */}
            <VStack align="start" maxW="300px">
              <Text fontSize="xl" fontWeight="bold" color="blue.500">
                Car Rental
              </Text>
              <Text fontSize="sm">
                Your trusted partner for reliable and affordable car rentals. 
                Explore the world with our premium fleet of vehicles.
              </Text>
              <HStack spacing={3}>
                <IconButton
                  aria-label="Facebook"
                  icon={<FaFacebook />}
                  size="sm"
                  variant="ghost"
                  color="blue.500"
                  _hover={{ bg: "blue.50" }}
                />
                <IconButton
                  aria-label="Twitter"
                  icon={<FaTwitter />}
                  size="sm"
                  variant="ghost"
                  color="blue.500"
                  _hover={{ bg: "blue.50" }}
                />
                <IconButton
                  aria-label="Instagram"
                  icon={<FaInstagram />}
                  size="sm"
                  variant="ghost"
                  color="blue.500"
                  _hover={{ bg: "blue.50" }}
                />
                <IconButton
                  aria-label="LinkedIn"
                  icon={<FaLinkedin />}
                  size="sm"
                  variant="ghost"
                  color="blue.500"
                  _hover={{ bg: "blue.50" }}
                />
              </HStack>
            </VStack>

            {/* Quick Links */}
            <VStack align="start" spacing={3}>
              <Text fontWeight="bold" fontSize="md">
                Quick Links
              </Text>
              <Stack spacing={2}>
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
            <VStack align="start" spacing={3}>
              <Text fontWeight="bold" fontSize="md">
                Services
              </Text>
              <Stack spacing={2}>
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
            <VStack align="start" spacing={3}>
              <Text fontWeight="bold" fontSize="md">
                Contact Us
              </Text>
              <Stack spacing={2}>
                <HStack spacing={3}>
                  <FaPhone size={14} />
                  <Text fontSize="sm">+45 12 34 56 78</Text>
                </HStack>
                <HStack spacing={3}>
                  <FaEnvelope size={14} />
                  <Text fontSize="sm">info@carrental.dk</Text>
                </HStack>
                <HStack spacing={3} align="start">
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
            spacing={4}
            justify="space-between"
            align="center"
          >
            <Text fontSize="sm">
              © 2025 Car Rental. All rights reserved.
            </Text>
            <HStack spacing={6}>
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