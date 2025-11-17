import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Badge,
  Image,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { Separator } from "@chakra-ui/react/separator";
import { FiCheckCircle, FiCalendar, FiMapPin, FiCreditCard } from "react-icons/fi";
import { Button } from "../Components/Button";

interface Booking {
  id: number;
  car_id: number;
  user_id: number;
  car_location?: string;
  pickup_at: string;
  return_at: string;
  status: string;
  price_total: number;
  created_at: string;
  updated_at: string;
  make: string;
  model: string;
  year: number;
  class: string;
  fuel_type: string;
  img_path: string;
}

const locationNames: Record<string, string> = {
  cph: "Copenhagen",
  aar: "Aarhus",
  odn: "Odense",
};

const capitalizeString = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LoadingState = () => (
  <Box p={8} maxW="900px" mx="auto">
    <VStack gap={6} align="start" w="full">
      <Skeleton height="48px" width="60%" />
      <SkeletonText noOfLines={2} width="40%" />
      <Skeleton height="300px" width="100%" borderRadius="lg" />
    </VStack>
  </Box>
);

const BookingConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        if (!res.ok) {
          throw new Error("Booking not found");
        }
        const data = await res.json();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) return <LoadingState />;

  if (!booking) {
    return (
      <Box p={8} maxW="900px" mx="auto" textAlign="center">
        <Heading size="md" mb={2}>
          Booking not found
        </Heading>
        <Text color="gray.600" mb={6}>
          The requested booking does not exist or was removed.
        </Text>
        <Button onClick={() => navigate("/cars")} variant="primary">
          Browse Cars
        </Button>
      </Box>
    );
  }

  const rentalDays = Math.ceil(
    (new Date(booking.return_at).getTime() - new Date(booking.pickup_at).getTime()) /
      (24 * 60 * 60 * 1000)
  );

  // Ensure price_total is handled safely even if backend returns it as a string
  const totalAmount = Number(booking.price_total);

  return (
    <Box p={{ base: 4, md: 8 }} maxW="900px" mx="auto">
      {/* Success Header */}
      <VStack gap={4} mb={8} textAlign="center">
        <Box color="green.500" fontSize="64px">
          <FiCheckCircle />
        </Box>
        <Heading size="2xl" color="green.600">
          Booking Confirmed!
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Your reservation has been successfully placed
        </Text>
        <Badge colorScheme="green" fontSize="md" px={4} py={2}>
          Booking #{booking.id}
        </Badge>
      </VStack>

      {/* Receipt Card */}
      <Box bg="white" borderRadius="xl" shadow="lg" p={8} mb={6}>
        {/* Car Info */}
        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={6} mb={6}>
          {booking.img_path && (
            <Image
              src={booking.img_path}
              alt={`${booking.make} ${booking.model}`}
              borderRadius="lg"
              objectFit="cover"
              h="150px"
              w="100%"
            />
          )}
          <VStack align="start" justify="center" gap={2}>
            <Heading size="lg">
              {capitalizeString(booking.make)} {capitalizeString(booking.model)}
            </Heading>
            <HStack gap={2} wrap="wrap">
              <Badge colorScheme="blue">{booking.year}</Badge>
              {booking.class && <Badge colorScheme="purple">{booking.class}</Badge>}
              {booking.fuel_type && <Badge colorScheme="green">{booking.fuel_type}</Badge>}
            </HStack>
          </VStack>
        </Grid>

        <Separator mb={6} />

        {/* Booking Details */}
        <VStack gap={4} align="stretch">
          <Heading size="md" mb={2}>
            Booking Details
          </Heading>

          <HStack gap={4} align="start">
            <Box color="blue.500" fontSize="24px" mt={1}>
              <FiCalendar />
            </Box>
            <Box flex={1}>
              <Text fontWeight="semibold" mb={1}>
                Pickup
              </Text>
              <Text color="gray.700">{formatDate(booking.pickup_at)}</Text>
              <Text color="gray.600" fontSize="sm" mt={1}>
                <FiMapPin style={{ display: "inline", marginRight: "4px" }} />
                {locationNames[booking.car_location || ''] || booking.car_location}
              </Text>
            </Box>
          </HStack>

          <HStack gap={4} align="start">
            <Box color="blue.500" fontSize="24px" mt={1}>
              <FiCalendar />
            </Box>
            <Box flex={1}>
              <Text fontWeight="semibold" mb={1}>
                Return
              </Text>
              <Text color="gray.700">{formatDate(booking.return_at)}</Text>
              <Text color="gray.600" fontSize="sm" mt={1}>
                <FiMapPin style={{ display: "inline", marginRight: "4px" }} />
                {locationNames[booking.car_location || ''] || booking.car_location}
              </Text>
            </Box>
          </HStack>

          <Separator my={2} />

          {/* Price Breakdown */}
          <Box>
            <Heading size="sm" mb={3}>
              Price Breakdown
            </Heading>
            <VStack gap={2} align="stretch">
              <HStack justify="space-between">
                <Text color="gray.600">Rental Duration</Text>
                <Text fontWeight="semibold">
                  {rentalDays} {rentalDays === 1 ? "day" : "days"}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="gray.600">Daily Rate</Text>
                <Text>399 DKK</Text>
              </HStack>
              <Separator />
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Total
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  {Number.isFinite(totalAmount) ? `${totalAmount.toFixed(2)}` : "--"} DKK
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Box bg="blue.50" p={4} borderRadius="md" mt={4}>
            <HStack gap={2} mb={2}>
              <FiCreditCard />
              <Text fontWeight="semibold">Payment Status</Text>
            </HStack>
            <Text fontSize="sm" color="gray.700">
              Payment will be processed at pickup. Please bring a valid credit card and driver's
              license.
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Action Buttons */}
      <HStack gap={4} justify="center" flexWrap="wrap">
        <Button onClick={() => navigate("/cars")} variant="outline" size="lg">
          Browse More Cars
        </Button>
        <Button onClick={() => navigate("/my-bookings")} variant="primary" size="lg">
          View My Bookings
        </Button>
      </HStack>

      {/* Confirmation Details */}
      <Box mt={8} p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="sm" color="gray.600" textAlign="center">
          A confirmation email has been sent to your registered email address.
          <br />
          Booking created on {formatDate(booking.created_at)}
        </Text>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;
