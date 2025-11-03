import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, Toaster } from "@chakra-ui/react";
import { toaster, renderToast } from "./utils/toaster";
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

export default function App() {
  return (
    <Router>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
      <Toaster toaster={toaster}>
        {(toast) => renderToast(toast)}
      </Toaster>
    </Router>
  );
}
