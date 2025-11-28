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
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { Button } from "../components/Button";
import { BookingsSkeletonLoader } from "../components/BookingsSkeletonLoader";
import {
  getUserBookings,
  cancelBooking,
  type UserBooking,
} from "../services/bookings";
import { toaster, TOAST_DURATIONS } from "../utils/toaster";

// Simplified: only showing make/model, image and actions per user request

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingBookingId, setCancelingBookingId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!user) {
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
        const errorMessage = "Failed to load bookings. Please try again.";
        setError(errorMessage);
        toaster.create({
          title: "Error",
          description: errorMessage,
          type: "error",
          duration: TOAST_DURATIONS.medium,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const hasBookings = useMemo(() => bookings.length > 0, [bookings]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancelingBookingId(bookingId);
      await cancelBooking(bookingId);

      // Update the booking status in the local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "canceled" as const }
            : booking
        )
      );

      toaster.create({
        title: "Booking canceled",
        description: "Your booking has been successfully canceled.",
        type: "success",
        duration: TOAST_DURATIONS.medium,
      });
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toaster.create({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        type: "error",
        duration: TOAST_DURATIONS.medium,
      });
    } finally {
      setCancelingBookingId(null);
    }
  };

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
            Review your upcoming and past reservations. You can always view a
            booking for full details.
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
                  <Box>
                    <Heading size="md" color="gray.800">
                      {booking.make ? `${booking.make} ${booking.model}` : "Car"}
                    </Heading>
                  </Box>

                  {booking.img_path ? (
                    <Image
                      src={booking.img_path}
                      alt={`${booking.make ?? ""} ${booking.model ?? ""}`.trim() || "Booked car"}
                      borderRadius="md"
                      height="200px"
                      objectFit="cover"
                    />
                  ) : (
                    <Skeleton height="200px" borderRadius="md" />
                  )}

                  <HStack gap={2} pt={2} width="100%">
                    <Box flex={1}>
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                        size="sm"
                        fullWidth
                      >
                        View Details
                      </Button>
                    </Box>

                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <Box flex={1}>
                        <Button
                          variant="danger"
                          onClick={() => handleCancelBooking(booking.id)}
                          size="sm"
                          disabled={cancelingBookingId === booking.id}
                          fullWidth
                        >
                          {cancelingBookingId === booking.id ? "Canceling..." : "Cancel"}
                        </Button>
                      </Box>
                    )}
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
                You have not made any bookings yet. Browse our selection of cars
                and reserve the perfect ride for your next trip.
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
