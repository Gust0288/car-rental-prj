import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { ToastProvider } from "./context/ToastContext";
import { NavBar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/home";
import CarsPage from "./pages/CarsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SingleCarView from "./pages/SingleCarView";
import BookingConfirmation from "./pages/BookingConfirmation";
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
              <Route path="/car/:id" element={<SingleCarView />} />
              <Route path="/bookings/:id" element={<BookingConfirmation />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </ToastProvider>
    </Router>
  );
}
