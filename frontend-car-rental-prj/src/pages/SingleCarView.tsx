// src/pages/SingleCarView.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import {
  VStack,
  Text,
  Box,
  Image,
  Heading,
  Grid,
  Badge,
  HStack,
  Skeleton,
  SkeletonText,
  Input,
  Stack,
  createToaster,
} from "@chakra-ui/react";
import { Field as ChakraField } from "@chakra-ui/react/field";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react/native-select";
import { Separator } from "@chakra-ui/react/separator";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "../components/Button";
import { getCars } from "../services/cars";
import type { Car } from "../services/cars";
import { useUser } from "../context/UserContext";

// Create toaster for notifications
const toaster = createToaster({
  placement: "top-end",
  duration: 3000,
});

const labelize = (s: string) =>
  s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const capitalizeString = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const safeText = (v: unknown) =>
  v === null || v === undefined || v === "" ? "N/A" : String(v);

// Convert MPG to L/100km and km/L for EU users
const mpgToLPer100 = (mpg?: number | null) => (mpg && mpg > 0 ? 235.214583 / mpg : null);
const mpgToKmPerL = (mpg?: number | null) => (mpg && mpg > 0 ? (mpg * 1.60934) / 3.78541 : null);

// Pretty print transmission codes if needed
const prettyTransmission = (t?: string | null) => {
  if (!t) return "N/A";
  const val = t.toLowerCase();
  if (val === "a" || val === "auto" || val === "automatic") return "Automatic";
  if (val === "m" || val === "man" || val === "manual") return "Manual";
  return t.toUpperCase();
};

const SpecItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <Box>
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
    <Text fontWeight="semibold">{value}</Text>
  </Box>
);

const LoadingBlock = () => (
  <Box p={8} maxW="1200px" mx="auto">
    <VStack gap={6} align="start" w="full">
      <Skeleton height="36px" width="40%" />
      <Skeleton height="400px" width="100%" borderRadius="lg" />
      <SkeletonText noOfLines={2} width="40%" />
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
        w="full"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} height="60px" borderRadius="md" />
        ))}
      </Grid>
    </VStack>
  </Box>
);

const SingleCarView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();
  const { user, isLoggedIn } = useUser();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  // Prefill booking state from URL if present
  const [pickupLocation, setPickupLocation] = useState(sp.get("pickupLocation") ?? "");
  const [returnLocation, setReturnLocation] = useState(sp.get("returnLocation") ?? "");
  const [pickupAt, setPickupAt] = useState(
    sp.get("pickupDate")
      ? `${sp.get("pickupDate")}T10:00`
      : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [returnAt, setReturnAt] = useState(
    sp.get("returnDate")
      ? `${sp.get("returnDate")}T10:00`
      : new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCars()
      .then((cars) => {
        const foundCar = cars.find((c: Car) => c.id === Number(id));
        setCar(foundCar || null);
      })
      .catch((err) => {
        console.error("Failed to fetch car:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const cityEU = useMemo(() => {
    const l100 = mpgToLPer100(car?.city_mpg ?? null);
    const kml = mpgToKmPerL(car?.city_mpg ?? null);
    return { l100, kml };
  }, [car?.city_mpg]);

  const hwyEU = useMemo(() => {
    const l100 = mpgToLPer100(car?.highway_mpg ?? null);
    const kml = mpgToKmPerL(car?.highway_mpg ?? null);
    return { l100, kml };
  }, [car?.highway_mpg]);

  const combEU = useMemo(() => {
    const l100 = mpgToLPer100(car?.combination_mpg ?? null);
    const kml = mpgToKmPerL(car?.combination_mpg ?? null);
    return { l100, kml };
  }, [car?.combination_mpg]);

  if (loading) return <LoadingBlock />;

  if (!car) {
    return (
      <Box p={8} maxW="900px" mx="auto" textAlign="center">
        <Heading size="md" mb={2}>
          Car not found
        </Heading>
        <Text color="gray.600" mb={6}>
          The requested car does not exist or was removed.
        </Text>
        <Button onClick={() => navigate(-1)}>
          <FiArrowLeft style={{ marginRight: "8px" }} /> Go back
        </Button>
      </Box>
    );
  }

  // Booking form helpers
  const dayMs = 24 * 60 * 60 * 1000;
  const start = new Date(pickupAt);
  const end = new Date(returnAt);
  const rentalDays =
    isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start
      ? 0
      : Math.ceil((end.getTime() - start.getTime()) / dayMs);
  const dailyRate = 399; // preview only, confirm on server
  const price = rentalDays * dailyRate;

  const errors = {
    pickupLocation: pickupLocation ? "" : "Choose pick up location",
    returnLocation: returnLocation ? "" : "Choose return location",
    pickupAt: start.getTime() > Date.now() - 60 * 1000 ? "" : "Pick up must be in the future",
    returnAt: end > start ? "" : "Return must be after pick up",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  async function handleBook() {
    if (hasErrors || !car) {
      toaster.create({ title: "Please fix the form", type: "error" });
      return;
    }

    // Check if user is logged in
    if (!isLoggedIn || !user) {
      toaster.create({ title: "Please log in to book", type: "warning" });
      navigate("/login?redirect=" + encodeURIComponent(location.pathname));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_id: car.id,
          user_id: user.id,
          pickup_location_id: pickupLocation, // adjust to numeric ids if needed
          return_location_id: returnLocation,
          pickup_at: new Date(pickupAt).toISOString(),
          return_at: new Date(returnAt).toISOString(),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Booking failed");
      }
      
      const booking = await res.json();
      toaster.create({ title: "Booking confirmed", type: "success" });
      
      // Navigate to confirmation page
      navigate(`/bookings/${booking.id}`);
    } catch (e: unknown) {
      toaster.create({
        title: "Could not complete booking",
        description: e instanceof Error ? e.message : "Unknown error",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
      <Box mb={4}>
        <Button onClick={() => navigate(-1)} variant="outline" size="md">
          <FiArrowLeft style={{ marginRight: "8px" }} /> Back
        </Button>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8} alignItems="start">
        {/* Left column: car info */}
        <VStack gap={6} align="start" w="full">
          <HStack align="center" wrap="wrap" gap={3}>
            <Heading size="xl">
              {capitalizeString(car.make)} {capitalizeString(car.model)}
            </Heading>
            <Badge colorScheme="purple" fontSize="0.9em">
              {car.year || "Unknown year"}
            </Badge>
            {car.class ? (
              <Badge colorScheme="blue" fontSize="0.9em">
                {labelize(car.class)}
              </Badge>
            ) : null}
            {car.fuel_type ? (
              <Badge colorScheme="green" fontSize="0.9em">
                {labelize(car.fuel_type)}
              </Badge>
            ) : null}
            {car.drive ? (
              <Badge colorScheme="orange" fontSize="0.9em">
                {car.drive.toUpperCase()}
              </Badge>
            ) : null}
          </HStack>

          {car.img_path ? (
            <Image
              src={car.img_path}
              alt={`${capitalizeString(car.make)} ${capitalizeString(car.model)}`}
              borderRadius="lg"
              maxH="520px"
              w="100%"
              objectFit="cover"
              bg="gray.50"
            />
          ) : (
            <Box
              w="100%"
              h="280px"
              bg="gray.100"
              borderRadius="lg"
              display="grid"
              placeItems="center"
            >
              <Text color="gray.500">No image</Text>
            </Box>
          )}

          <Box w="full">
            <Heading size="md" mb={3}>
              Specs
            </Heading>
            <Grid
              gap={6}
              w="full"
              templateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
            >
              <SpecItem label="Make" value={capitalizeString(car.make)} />
              <SpecItem label="Model" value={capitalizeString(car.model)} />
              <SpecItem label="Year" value={safeText(car.year)} />
              <SpecItem label="Class" value={safeText(car.class && labelize(car.class))} />
              <SpecItem
                label="Fuel Type"
                value={safeText(car.fuel_type && labelize(car.fuel_type))}
              />
              <SpecItem label="Drive" value={safeText(car.drive && car.drive.toUpperCase())} />
              <SpecItem label="Transmission" value={prettyTransmission(car.transmission)} />
              <SpecItem label="Cylinders" value={safeText(car.cylinders)} />
              <SpecItem label="Displacement" value={car.displacement ? `${car.displacement} L` : "N/A"} />
              <SpecItem
                label="City MPG"
                value={
                  car.city_mpg
                    ? `${car.city_mpg} mpg • ${cityEU.kml?.toFixed(2)} km/L • ${cityEU.l100?.toFixed(
                        1
                      )} L/100km`
                    : "N/A"
                }
              />
              <SpecItem
                label="Highway MPG"
                value={
                  car.highway_mpg
                    ? `${car.highway_mpg} mpg • ${hwyEU.kml?.toFixed(2)} km/L • ${hwyEU.l100?.toFixed(
                        1
                      )} L/100km`
                    : "N/A"
                }
              />
              <SpecItem
                label="Combined MPG"
                value={
                  car.combination_mpg
                    ? `${car.combination_mpg} mpg • ${combEU.kml?.toFixed(2)} km/L • ${combEU.l100?.toFixed(
                        1
                      )} L/100km`
                    : "N/A"
                }
              />
              <SpecItem label="ID" value={safeText(car.id)} />
            </Grid>
          </Box>
        </VStack>

        {/* Right column: booking card */}
        <Box position="sticky" top="16px" bg="white" borderRadius="lg" shadow="md" p={5}>
          <Heading size="md" mb={2}>
            Book this car
          </Heading>
          <Text color="gray.600" mb={4}>
            {rentalDays > 0 ? `${rentalDays} day rental` : "Select dates"}
          </Text>

          <Stack gap={4}>
            <ChakraField.Root invalid={!!errors.pickupLocation}>
              <ChakraField.Label>Pick up location</ChakraField.Label>
              <NativeSelectRoot>
                <NativeSelectField
                  placeholder="Select location"
                  value={pickupLocation}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPickupLocation(e.target.value)}
                >
                  {/* Replace with your real locations */}
                  <option value="cph">Copenhagen</option>
                  <option value="aar">Aarhus</option>
                  <option value="odn">Odense</option>
                </NativeSelectField>
              </NativeSelectRoot>
              {errors.pickupLocation && <ChakraField.ErrorText>{errors.pickupLocation}</ChakraField.ErrorText>}
            </ChakraField.Root>

            <ChakraField.Root invalid={!!errors.returnLocation}>
              <ChakraField.Label>Return location</ChakraField.Label>
              <NativeSelectRoot>
                <NativeSelectField
                  placeholder="Select location"
                  value={returnLocation}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReturnLocation(e.target.value)}
                >
                  <option value="cph">Copenhagen</option>
                  <option value="aar">Aarhus</option>
                  <option value="odn">Odense</option>
                </NativeSelectField>
              </NativeSelectRoot>
              {errors.returnLocation && <ChakraField.ErrorText>{errors.returnLocation}</ChakraField.ErrorText>}
            </ChakraField.Root>

            <ChakraField.Root invalid={!!errors.pickupAt}>
              <ChakraField.Label>Pick up date and time</ChakraField.Label>
              <Input
                type="datetime-local"
                value={pickupAt}
                onChange={(e) => setPickupAt(e.target.value)}
              />
              {errors.pickupAt && <ChakraField.ErrorText>{errors.pickupAt}</ChakraField.ErrorText>}
            </ChakraField.Root>

            <ChakraField.Root invalid={!!errors.returnAt}>
              <ChakraField.Label>Return date and time</ChakraField.Label>
              <Input
                type="datetime-local"
                value={returnAt}
                onChange={(e) => setReturnAt(e.target.value)}
                min={pickupAt}
              />
              {errors.returnAt && <ChakraField.ErrorText>{errors.returnAt}</ChakraField.ErrorText>}
            </ChakraField.Root>

            <Separator />

            <HStack justify="space-between">
              <Text color="gray.600">Price</Text>
              <Heading size="md">{price > 0 ? `${price} DKK` : "--"}</Heading>
            </HStack>

            <Button
              onClick={handleBook}
              isLoading={submitting}
              disabled={hasErrors || rentalDays === 0}
              variant="primary"
              size="lg"
            >
              Book car
            </Button>

            <Text fontSize="xs" color="gray.500" textAlign="center">
              You will not be charged yet. Final price is confirmed during checkout.
            </Text>
          </Stack>
        </Box>
      </Grid>
    </Box>
  );
};

export default SingleCarView;
