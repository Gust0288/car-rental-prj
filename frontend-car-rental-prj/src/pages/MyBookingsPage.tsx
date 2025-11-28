import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import { Button } from "../components/Button";
import { BookingsSkeletonLoader } from "../components/BookingsSkeletonLoader";
import { getUserBookings, cancelBooking, type UserBooking } from "../services/bookings";
import { toaster, TOAST_DURATIONS } from "../utils/toaster";

// Simplified page: only show car make/model, image, and action buttons.

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingBookingId, setCancelingBookingId] = useState<number | null>(null);

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

  // no-op: simplified page only needs bookings.length checks inline

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancelingBookingId(bookingId);
      await cancelBooking(bookingId);
      
      // Update the booking status in the local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
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
          <Text color="gray.600">Quick view of your reserved cars.</Text>
        </Box>

        {error && (
          <Box color="red.700">{error}</Box>
        )}

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {Array.from({ length: 2 }).map((_, index) => (
              <Box key={index} p={6} borderRadius="lg" bg="white" shadow="sm">
                <Skeleton height="160px" borderRadius="md" mb={4} />
                <VStack align="stretch" gap={3}>
                  <Skeleton height="18px" width="60%" />
                  <Skeleton height="14px" width="40%" />
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : bookings.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {bookings.map((booking) => (
              <Box
                key={booking.id}
                p={4}
                borderRadius="lg"
                bg="white"
                shadow="md"
                border="1px solid"
                borderColor="gray.100"
              >
                <VStack align="stretch" gap={3}>
                  {booking.img_path ? (
                    <Image
                      src={booking.img_path}
                      alt={`${booking.make ?? ""} ${booking.model ?? ""}`.trim() || "Car image"}
                      borderRadius="md"
                      height="160px"
                      objectFit="cover"
                    />
                  ) : (
                    <Box height="160px" bg="gray.100" borderRadius="md" />
                  )}

                  <Box>
                    <Heading size="md">
                      {booking.make ? `${booking.make} ${booking.model ?? ""}` : booking.model ?? "Car"}
                    </Heading>
                  </Box>

                  <HStack gap={3} mt={2}>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                      size="sm"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleCancelBooking(booking.id)}
                      size="sm"
                      disabled={cancelingBookingId === booking.id}
                      variant="outline"
                    >
                      {cancelingBookingId === booking.id ? "Canceling..." : "Cancel Order"}
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12}>
            <Heading size="md">No bookings yet</Heading>
            <Text color="gray.600">You have not made any bookings yet.</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default MyBookingsPage;
