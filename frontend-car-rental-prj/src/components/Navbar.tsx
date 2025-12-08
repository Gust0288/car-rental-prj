import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useDebounce } from "../hooks/useDebounce";
import { carService } from "../services/api-client";
import type { Car } from "../services/cars";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoggedIn } = useUser();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Search state and debounced navigation
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [suggestions, setSuggestions] = useState<Car[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const suppressNavRef = useRef(false);
  useEffect(() => {
    // Only auto-clear the URL when the input becomes empty while on /cars
    // (we navigate to /cars to remove the query string). We DO NOT navigate
    // on debounced changes anymore — navigation happens only on Enter or
    // when the user clicks a suggestion.
    try {
      const onCarsPath = location.pathname.startsWith("/cars");

      if (debouncedSearch === "" && onCarsPath && location.search) {
        navigate(`/cars`);
      }
    } catch (e) {
      console.error("Navbar search navigation error:", e);
    }
  }, [debouncedSearch, navigate, location.pathname, location.search]);

  // Fetch suggestions for the dropdown when the debounced search changes
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!debouncedSearch || debouncedSearch.length === 0) {
        setSuggestions([]);
        return;
      }
      setSuggestionsLoading(true);
      try {
        const resp = await carService.getAllCars(debouncedSearch, 5);
        const data = resp?.data || [];
        if (mounted) setSuggestions(data as Car[]);
      } catch (err) {
        // swallow suggestion errors but clear suggestions
        console.error("Failed to load suggestions", err);
        if (mounted) setSuggestions([]);
      } finally {
        if (mounted) setSuggestionsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [debouncedSearch]);

  // close suggestions when clicking outside
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const isAdmin = user?.admin === 1;
  const effectiveIsAdmin = isAdmin;

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
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="white"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          Car Rental
        </Text>
        {/* debug badge removed */}

        <HStack maxW="400px" mx={4} width="100%">
          <Box ref={wrapperRef} width="100%" position="relative">
            <Input
              placeholder="Search for cars..."
              bg="white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  try {
                    const trimmed = search.trim();
                    if (trimmed.length > 0) {
                      // Fetch suggestions (show in dropdown) instead of navigating
                      setSuggestionsLoading(true);
                      try {
                        const resp = await carService.getAllCars(trimmed, 10);
                        const data = resp?.data || [];
                        setSuggestions(data as Car[]);
                      } catch (fetchErr) {
                        console.error("Search fetch error:", fetchErr);
                        setSuggestions([]);
                      } finally {
                        setSuggestionsLoading(false);
                      }
                    } else {
                      // if empty and we're on /cars with a query, clear it
                      if (
                        location.pathname.startsWith("/cars") &&
                        location.search
                      ) {
                        navigate(`/cars`);
                      }
                    }
                  } catch (err) {
                    console.error("Navbar Enter error:", err);
                  }
                }
              }}
              aria-label="Search cars"
              size="sm"
              pr="3rem"
            />
            {search ? (
              <Button
                size="sm"
                variant="ghost"
                color="gray.600"
                onClick={() => {
                  setSearch("");
                  setSuggestions([]);
                }}
                position="absolute"
                right="1px"
                top="50%"
                transform="translateY(-50%)"
              >
                ×
              </Button>
            ) : null}

            {(suggestionsLoading ||
              (debouncedSearch && debouncedSearch.length > 0)) && (
              <Box
                position="absolute"
                top="calc(100% + 6px)"
                left={0}
                right={0}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                shadow="md"
                zIndex={50}
                maxH="300px"
                overflowY="auto"
              >
                {suggestionsLoading ? (
                  <HStack p={3} justifyContent="center">
                    <Spinner size="sm" />
                    <Text fontSize="sm">Loading...</Text>
                  </HStack>
                ) : (
                  <Box>
                    {suggestions && suggestions.length > 0 ? (
                      suggestions.map((c) => (
                        <Box
                          key={c.id}
                          _hover={{ bg: "gray.50" }}
                          cursor="pointer"
                          px={3}
                          py={2}
                          onClick={() => {
                            // prevent the debounced search effect from forcing a
                            // navigation back to /cars (debouncedSearch may still
                            // be non-empty until the debounce fires).
                            suppressNavRef.current = true;
                            setSearch("");
                            setSuggestions([]);
                            navigate(`/car/${c.id}`);
                          }}
                        >
                          <HStack gap={3}>
                            {c.img_path ? (
                              <Image
                                src={c.img_path}
                                boxSize="48px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                            ) : null}
                            <Box>
                              <Text fontWeight="semibold">
                                {c.make} {c.model}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {c.year || ""} · {c.car_location || ""}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      ))
                    ) : (
                      <Box px={3} py={2}>
                        <Text fontSize="sm" color="gray.600">
                          No search results
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </HStack>

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
          {isLoggedIn && (
            <Button
              variant={isActivePath("/my-bookings") ? "solid" : "ghost"}
              size="sm"
              color={isActivePath("/my-bookings") ? "blue.500" : "white"}
              bg={isActivePath("/my-bookings") ? "white" : "transparent"}
              _hover={{
                bg: isActivePath("/my-bookings") ? "gray.100" : "blue.600",
              }}
              onClick={() => navigate("/my-bookings")}
            >
              My Bookings
            </Button>
          )}
          {isLoggedIn && user ? (
            <>
              <Button
                variant={isActivePath("/profile") ? "solid" : "ghost"}
                size="sm"
                color={isActivePath("/profile") ? "blue.500" : "white"}
                bg={isActivePath("/profile") ? "white" : "transparent"}
                _hover={{
                  bg: isActivePath("/profile") ? "gray.100" : "blue.600",
                }}
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
              {effectiveIsAdmin && (
                <Button
                  variant={isActivePath("/admin") ? "solid" : "ghost"}
                  size="sm"
                  color={isActivePath("/admin") ? "blue.500" : "white"}
                  bg={isActivePath("/admin") ? "white" : "transparent"}
                  _hover={{
                    bg: isActivePath("/admin") ? "gray.100" : "blue.600",
                  }}
                  onClick={() => navigate("/admin")}
                >
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                color="white"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={isActivePath("/login") ? "solid" : "ghost"}
                size="sm"
                color={isActivePath("/login") ? "blue.500" : "white"}
                bg={isActivePath("/login") ? "white" : "transparent"}
                _hover={{
                  bg: isActivePath("/login") ? "gray.100" : "blue.600",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant={isActivePath("/signup") ? "solid" : "ghost"}
                size="sm"
                color={isActivePath("/signup") ? "blue.500" : "white"}
                bg={isActivePath("/signup") ? "white" : "transparent"}
                _hover={{
                  bg: isActivePath("/signup") ? "gray.100" : "blue.600",
                }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </>
          )}
          {/* Admin button moved next to Profile for desktop layout */}
        </HStack>
      </HStack>

      {/* Mobile Navigation */}
      <HStack
        justifyContent="space-between"
        width="100%"
        display={{ base: "flex", md: "none" }}
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          color="white"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
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
        <Box px={4} py={3} borderTop="1px" borderColor="blue.400" ref={wrapperRef} position="relative">
          <Input 
            placeholder="Search for cars..." 
            width="100%" 
            bg="white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                try {
                  const trimmed = search.trim();
                  if (trimmed.length > 0) {
                    setSuggestionsLoading(true);
                    try {
                      const resp = await carService.getAllCars(trimmed, 10);
                      const data = resp?.data || [];
                      setSuggestions(data as Car[]);
                    } catch (fetchErr) {
                      console.error("Search fetch error:", fetchErr);
                      setSuggestions([]);
                    } finally {
                      setSuggestionsLoading(false);
                    }
                  } else {
                    setSuggestions([]);
                  }
                } catch (err) {
                  console.error("Search error:", err);
                  setSuggestions([]);
                }
              }
            }}
          />
          {suggestions && suggestions.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left={4}
              right={4}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              maxH="300px"
              overflowY="auto"
              zIndex={1000}
              mt={1}
            >
              {suggestionsLoading ? (
                <HStack p={3} justifyContent="center">
                  <Spinner size="sm" />
                  <Text fontSize="sm">Loading...</Text>
                </HStack>
              ) : (
                <Box>
                  {suggestions.map((c) => (
                    <Box
                      key={c.id}
                      _hover={{ bg: "gray.50" }}
                      cursor="pointer"
                      px={3}
                      py={2}
                      onClick={() => {
                        suppressNavRef.current = true;
                        setSearch("");
                        setSuggestions([]);
                        navigate(`/car/${c.id}`);
                      }}
                    >
                      <HStack gap={3}>
                        {c.img_path ? (
                          <Image
                            src={c.img_path}
                            boxSize="48px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        ) : null}
                        <Box>
                          <Text fontWeight="semibold">
                            {c.make} {c.model}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {c.year || ""} · {c.car_location || ""}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
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

            {isLoggedIn && user ? (
              <>
                <Button
                  variant={isActivePath("/my-bookings") ? "solid" : "outline"}
                  colorScheme="blue"
                  onClick={() => {
                    navigate("/my-bookings");
                    handleToggle();
                  }}
                  width="100%"
                  justifyContent="center"
                  borderWidth="1px"
                  _hover={{
                    bg: isActivePath("/my-bookings") ? "blue.600" : "blue.50",
                  }}
                  size="md"
                  fontSize="md"
                  fontWeight="medium"
                  py={3}
                >
                  My Bookings
                </Button>
                <Button
                  variant={isActivePath("/profile") ? "solid" : "outline"}
                  colorScheme="blue"
                  onClick={() => {
                    navigate("/profile");
                    handleToggle();
                  }}
                  width="100%"
                  justifyContent="center"
                  borderWidth="1px"
                  _hover={{
                    bg: isActivePath("/profile") ? "blue.600" : "blue.50",
                  }}
                  size="md"
                  fontSize="md"
                  fontWeight="medium"
                  py={3}
                >
                  Profile
                </Button>
                {effectiveIsAdmin && (
                  <Button
                    variant={isActivePath("/admin") ? "solid" : "outline"}
                    colorScheme="blue"
                    onClick={() => {
                      navigate("/admin");
                      handleToggle();
                    }}
                    width="100%"
                    justifyContent="center"
                    borderWidth="1px"
                    _hover={{
                      bg: isActivePath("/admin") ? "blue.600" : "blue.50",
                    }}
                    size="md"
                    fontSize="md"
                    fontWeight="medium"
                    py={3}
                  >
                    Admin
                  </Button>
                )}
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={() => {
                    logout();
                    navigate("/");
                    handleToggle();
                  }}
                  width="100%"
                  size="md"
                  fontSize="md"
                  fontWeight="semibold"
                  py={3}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
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
                  _hover={{
                    bg: isActivePath("/login") ? "blue.600" : "blue.50",
                  }}
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
              </>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};
