import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { Separator } from "@chakra-ui/react/separator";
import { FiCalendar, FiMapPin, FiAlertCircle } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { Button } from "../components/Button";
import { BookingsSkeletonLoader } from "../components/BookingsSkeletonLoader";
import { getUserBookings, type UserBooking } from "../services/bookings";

const locationNames: Record<string, string> = {
  cph: "Copenhagen",
  aar: "Aarhus",
  odn: "Odense",
};

const statusStyles: Record<UserBooking["status"], { bg: string }> = {
  pending: { bg: "yellow.100" },
  confirmed: { bg: "green.100" },
  in_progress: { bg: "blue.100"},
  returned: { bg: "purple.100"},
  canceled: { bg: "red.100"},
};

const formatDate = (date: string) => {
  const value = new Date(date);
  return value.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (!storedUser || !storedToken) {
        navigate("/login", { replace: true, state: { from: "/my-bookings" } });
      }
      return;
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserBookings(user.id);
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, user]);

  const hasBookings = useMemo(() => bookings.length > 0, [bookings]);

  if (!user) {
    return <BookingsSkeletonLoader count={3} />;
  }

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" gap={8}>
        <Box>
          <Heading size="xl" color="gray.800" mb={2}>
            My Bookings
          </Heading>
          <Text color="gray.600">
            Review your upcoming and past reservations. You can always view a booking for full details.
          </Text>
        </Box>

        {error && (
          <Box
            borderRadius="md"
            border="1px solid"
            borderColor="red.200"
            bg="red.50"
            color="red.700"
            p={4}
          >
            <HStack align="start" gap={3}>
              <Box fontSize="lg" mt={0.5}>
                <FiAlertCircle />
              </Box>
              <Box>
                <Text fontWeight="semibold" mb={1}>
                  Error
                </Text>
                <Text fontSize="sm">{error}</Text>
              </Box>
            </HStack>
          </Box>
        )}

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {Array.from({ length: 2 }).map((_, index) => (
              <Box key={index} p={6} borderRadius="lg" bg="white" shadow="sm">
                <Skeleton height="160px" borderRadius="md" mb={4} />
                <VStack align="stretch" gap={3}>
                  <Skeleton height="14px" width="65%" />
                  <Skeleton height="14px" width="45%" />
                  <Skeleton height="14px" width="75%" />
                  <Skeleton height="14px" width="55%" />
                  <Skeleton height="14px" width="35%" />
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : hasBookings ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {bookings.map((booking) => (
              <Box
                key={booking.id}
                p={6}
                borderRadius="lg"
                bg="white"
                shadow="md"
                border="1px solid"
                borderColor="gray.100"
              >
                <VStack align="stretch" gap={5}>
                  <HStack justify="space-between" align="start">
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        Booking #{booking.id}
                      </Text>
                      <Heading size="md" color="gray.800">
                        {booking.make ? `${booking.make} ${booking.model}` : "Car"}
                      </Heading>
                      {booking.year && (
                        <Text color="gray.600" fontSize="sm">
                          {booking.year}
                        </Text>
                      )}
                    </Box>
                    <Badge
                      bg={statusStyles[booking.status]?.bg ?? "gray.100"}
                      textTransform="capitalize"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="semibold"
                    >
                      {booking.status.replace(/_/g, " ")}
                    </Badge>
                  </HStack>

                  {booking.img_path && (
                    <Image
                      src={booking.img_path}
                      alt={`${booking.make ?? ""} ${booking.model ?? ""}`.trim() || "Booked car"}
                      borderRadius="md"
                      height="160px"
                      objectFit="cover"
                    />
                  )}

                  <VStack align="stretch" gap={4}>
                    <Box>
                      <HStack gap={3} color="blue.500" fontWeight="semibold">
                        <FiCalendar />
                        <Text>Pickup</Text>
                      </HStack>
                        <Text color="gray.700" mt={1}>
                          {formatDate(booking.pickup_at)}
                        </Text>
                        <HStack color="gray.600" fontSize="sm" mt={1}>
                          <FiMapPin />
                          <Text>{locationNames[booking.car_location ?? ""] ?? booking.car_location ?? "N/A"}</Text>
                        </HStack>
                    </Box>

                    <Separator />

                    <Box>
                      <HStack gap={3} color="blue.500" fontWeight="semibold">
                        <FiCalendar />
                        <Text>Return</Text>
                      </HStack>
                      <Text color="gray.700" mt={1}>
                        {formatDate(booking.return_at)}
                      </Text>
                      <HStack color="gray.600" fontSize="sm" mt={1}>
                        <FiMapPin />
                        <Text>{locationNames[booking.car_location ?? ""] ?? booking.car_location ?? "N/A"}</Text>
                      </HStack>
                    </Box>
                  </VStack>

                  <HStack justify="space-between" pt={2}>
                    <Text fontWeight="bold" color="gray.800">
                      Total: {(() => {
                        const amt = Number(booking.price_total);
                        return Number.isFinite(amt) ? `${amt.toFixed(2)} DKK` : "--";
                      })()}
                    </Text>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                      size="sm"
                    >
                      View Details
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            bg="gray.50"
            p={{ base: 8, md: 12 }}
            textAlign="center"
          >
            <VStack gap={4}>
              <Box fontSize="4xl" color="gray.400">
                <FiAlertCircle />
              </Box>
              <Heading size="md">No bookings yet</Heading>
              <Text color="gray.600" maxW="md">
                You have not made any bookings yet. Browse our selection of cars and reserve the perfect ride for your next trip.
              </Text>
              <Button variant="primary" onClick={() => navigate("/cars")}>
                Browse Cars
              </Button>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default MyBookingsPage;
