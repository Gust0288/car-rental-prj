import React, { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
  Button,
  Badge,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useGlobalToast } from "../context/ToastContext";
import { FiTrash2, FiXCircle } from "react-icons/fi";
import { adminService, bookingService } from "../services/api-client";

interface UserRow {
  id: number;
  username: string;
  name: string;
  user_last_name?: string;
  email: string;
  admin?: number;
  user_created_at?: string;
  user_deleted_at?: string | null;
}

interface BookingRow {
  id: number;
  user_id: number;
  car_id: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [bookings, setBookings] = useState<BookingRow[] | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const { showToast } = useGlobalToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const [activeTab, setActiveTab] = useState<"users" | "bookings">("users");
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await adminService.listUsers();
      setUsers(res.data);
    } catch (err) {
      showToast({ title: "Failed to load users", status: "error" });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSoftDeleteUser = async (id: number) => {
    const ok = window.confirm(
      "Are you sure you want to delete this user? This action will delete the account."
    );
    if (!ok) return;
    try {
      await adminService.softDeleteUser(id);
      // show toast first, then refresh after a short delay so the toast is visible
      showToast({ title: "User soft-deleted", status: "success" });
      setTimeout(() => fetchUsers(), 400);
    } catch (err) {
      showToast({ title: "Failed to delete user", status: "error" });
    }
  };

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await bookingService.getAll();
      setBookings(res.data);
    } catch (err) {
      showToast({ title: "Failed to load bookings", status: "error" });
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (id: number) => {
    const ok = window.confirm("Are you sure you want to cancel this booking?");
    if (!ok) return;
    try {
      await bookingService.cancel(id);
      showToast({ title: "Booking cancelled", status: "success" });
      setTimeout(() => fetchAllBookings(), 400);
    } catch (err) {
      showToast({ title: "Failed to cancel booking", status: "error" });
    }
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack gap={4.5} align="stretch">
        <Box>
          <Heading size="lg">Admin Dashboard</Heading>
          <Text color="gray.600" mt={1}>
            Manage users and bookings
          </Text>
        </Box>

        <Box bg="white" p={4} borderRadius="md" shadow="sm">
          <HStack gap={4} mb={4}>
            <Button
              onClick={() => {
                setActiveTab("users");
                fetchUsers();
              }}
              bg={activeTab === "users" ? "blue.500" : "transparent"}
              color={activeTab === "users" ? "white" : "gray.700"}
              border={activeTab === "users" ? undefined : "1px solid"}
              borderColor={activeTab === "users" ? undefined : "gray.200"}
              _hover={
                activeTab === "users" ? { bg: "blue.600" } : { bg: "gray.100" }
              }
            >
              Users
            </Button>
            <Button
              onClick={() => {
                setActiveTab("bookings");
                fetchAllBookings();
              }}
              bg={activeTab === "bookings" ? "blue.500" : "transparent"}
              color={activeTab === "bookings" ? "white" : "gray.700"}
              border={activeTab === "bookings" ? undefined : "1px solid"}
              borderColor={activeTab === "bookings" ? undefined : "gray.200"}
              _hover={
                activeTab === "bookings"
                  ? { bg: "blue.600" }
                  : { bg: "gray.100" }
              }
            >
              Bookings
            </Button>
            {activeTab === "users" && (
              <label
                style={{
                  marginLeft: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  checked={showDeleted}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setShowDeleted(e.target.checked)
                  }
                />
                <span>Show deleted</span>
              </label>
            )}
          </HStack>

          {activeTab === "users" && (
            <Box mb={6}>
              <Heading size="sm" mb={3}>
                Users
              </Heading>
              {loadingUsers ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                <VStack align="stretch" gap={2}>
                  {users
                    ?.filter((u) => (showDeleted ? true : !u.user_deleted_at))
                    .map((u) => (
                      <HStack
                        key={u.id}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        justify="space-between"
                        opacity={u.user_deleted_at ? 0.6 : 1}
                      >
                        <Box>
                          <Text fontWeight="semibold">
                            {u.username}{" "}
                            {u.user_last_name ? `(${u.user_last_name})` : ""}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {u.email}
                          </Text>
                        </Box>
                        <HStack>
                          <Badge>{u.admin === 1 ? "Admin" : "User"}</Badge>
                          <Text fontSize="sm">
                            {u.user_deleted_at
                              ? `Deleted: ${new Date(
                                  u.user_deleted_at
                                ).toLocaleString()}`
                              : `Created: ${
                                  u.user_created_at
                                    ? new Date(
                                        u.user_created_at
                                      ).toLocaleString()
                                    : "-"
                                }`}
                          </Text>
                          {!u.user_deleted_at && (
                            <IconButton
                              aria-label="Delete user"
                              size="sm"
                              onClick={() => handleSoftDeleteUser(u.id)}
                              bg="red.500"
                              color="white"
                              _hover={{ bg: "red.600" }}
                            >
                              <FiTrash2 />
                            </IconButton>
                          )}
                        </HStack>
                      </HStack>
                    ))}
                </VStack>
              )}
            </Box>
          )}

          {activeTab === "bookings" && (
            <Box mt={6}>
              <HStack justify="space-between" mb={4}>
                <Heading size="sm">Bookings</Heading>
              </HStack>

              {loadingBookings ? (
                <Flex justify="center">
                  <Spinner />
                </Flex>
              ) : (
                <VStack align="stretch" gap={2}>
                  {bookings?.map((b) => (
                    <HStack
                      key={b.id}
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      justify="space-between"
                    >
                      <Box>
                        <Text fontWeight="semibold">Booking #{b.id}</Text>
                        <Text fontSize="sm" color="gray.600">
                          User: {b.user_id} • Car: {b.car_id}
                        </Text>
                      </Box>
                      <HStack>
                        <Text fontSize="sm">
                          Created:{" "}
                          {b.created_at
                            ? new Date(b.created_at).toLocaleString()
                            : "-"}
                        </Text>
                        <IconButton
                          aria-label="Cancel booking"
                          size="sm"
                          onClick={() => handleCancelBooking(b.id)}
                          bg="red.500"
                          color="white"
                          _hover={{ bg: "red.600" }}
                        >
                          <FiXCircle />
                        </IconButton>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default AdminPage;
