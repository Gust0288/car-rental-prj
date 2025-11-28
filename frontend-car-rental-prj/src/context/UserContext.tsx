import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "../services/api-client";

interface User {
  id: number;
  username: string;
  name: string;
  user_last_name: string;
  email: string;
  admin?: number;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (loginData: LoginResponse) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Normalizes the admin field to a numeric value (0 or 1)
 */
const normalizeAdminValue = (adminValue: unknown): number => {
  if (adminValue === true || adminValue === 1) return 1;
  if (adminValue === false || adminValue === 0) return 0;
  
  if (typeof adminValue === "string") {
    const normalizedString = adminValue.toLowerCase().trim();
    if (["1", "true", "t", "yes"].includes(normalizedString)) return 1;
  }
  
  return 0;
};

/**
 * Normalizes a user object by ensuring the admin field is a numeric value
 */
const normalizeUserData = (userData: User): User => {
  const rawAdminValue = (userData as unknown as Record<string, unknown>)["admin"];
  return {
    ...userData,
    admin: normalizeAdminValue(rawAdminValue),
  };
};


const saveToLocalStorage = (userData: User, authToken: string): void => {
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", authToken);
};


const clearLocalStorage = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (loginData: LoginResponse) => {
    const normalizedUser = normalizeUserData(loginData.user);
    setUser(normalizedUser);
    setToken(loginData.token);
    saveToLocalStorage(normalizedUser, loginData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearLocalStorage();
  };

  // Initialize user from localStorage and refresh from server
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      const normalizedUser = normalizeUserData(parsedUser);
      
      setUser(normalizedUser);
      setToken(storedToken);

      // Fetch fresh profile from server to ensure data is up-to-date
      const refreshUserProfile = async () => {
        try {
          const profileId = normalizedUser.id;
          if (!profileId) return;

          const profileResponse = await authService.getProfile(profileId);
          if (profileResponse?.data) {
            const freshUserData = normalizeUserData(profileResponse.data);
            setUser(freshUserData);
            saveToLocalStorage(freshUserData, storedToken);
          }
        } catch (error) {
          console.debug("Failed to refresh user profile:", error);
        }
      };

      refreshUserProfile();
    } catch (error) {
      console.error("Failed to parse stored user data:", error);
      clearLocalStorage();
    }
  }, []);

  const contextValue = {
    user,
    token,
    login,
    logout,
    isLoggedIn: !!user,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
