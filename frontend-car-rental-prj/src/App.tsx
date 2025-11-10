import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Toaster } from "@chakra-ui/react";
import { ToastProvider } from "./context/ToastContext";
import { toaster } from "./utils/toaster";
import { NavBar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import Home from "./pages/home";
import CarsPage from "./pages/CarsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SingleCarView from "./pages/SingleCarView";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <Box minH="100vh" display="flex" flexDirection="column">
          <NavBar />
          <Box flex="1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/car/:id" element={<SingleCarView />} />
              <Route path="/bookings/:id" element={<BookingConfirmation />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
       
        <Toaster toaster={toaster}>
          {(toast) => (
            <Box
              px={4}
              py={3}
              bg={
                toast.type === 'success' ? 'green.500' : 
                toast.type === 'error' ? 'red.500' : 
                toast.type === 'warning' ? 'orange.500' : 
                'blue.500'
              }
              color="white"
              borderRadius="md"
              boxShadow="lg"
            >
              {toast.title && <Box fontWeight="bold" mb={1}>{toast.title}</Box>}
              {toast.description && <Box fontSize="sm">{toast.description}</Box>}
            </Box>
          )}
        </Toaster>
      </ToastProvider>
    </Router>
  );
}
