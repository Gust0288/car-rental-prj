import React, {
  createContext,
  useContext,
  useState,
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

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (loginData: LoginResponse) => {
    // Normalize admin to numeric 0/1 for consistent client-side checks
    const normalizedUser = { ...loginData.user } as User;
    const rawAdmin = ((loginData.user as unknown) as Record<string, unknown>)[
      "admin"
    ];
    let adminVal = 0;
    if (rawAdmin === true) adminVal = 1;
    else if (typeof rawAdmin === "number") adminVal = rawAdmin;
    else if (typeof rawAdmin === "string") {
      const s = rawAdmin.toLowerCase();
      if (s === "1" || s === "true" || s === "t" || s === "yes") adminVal = 1;
    }
    normalizedUser.admin = adminVal;
    setUser(normalizedUser);
    setToken(loginData.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", loginData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Check localStorage on initial load
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        // Normalize admin value to numeric 0/1 if present
        if (parsed) {
          const rawAdmin = parsed?.admin;
          let adminVal = 0;
          if (rawAdmin === true) adminVal = 1;
          else if (typeof rawAdmin === "number") adminVal = rawAdmin;
          else if (typeof rawAdmin === "string") {
            const s = rawAdmin.toLowerCase();
            if (s === "1" || s === "true" || s === "t" || s === "yes") adminVal = 1;
          }
          parsed.admin = adminVal;
        }
        setUser(parsed);
        setToken(storedToken);

        // If we have a token and an id, fetch a fresh profile from the server
        // to ensure fields like `admin` are up-to-date (helps when server-side
        // encoding differs or older localStorage lacks admin).
        (async () => {
          try {
            const pid = parsed?.id;
            if (pid && storedToken) {
              const resp = await authService.getProfile(pid as number);
              if (resp?.data) {
                const serverUser = resp.data;
                // normalize admin
                const rawAdmin = ((serverUser as unknown) as Record<string, unknown>)[
                  "admin"
                ];
                let adminVal = 0;
                if (rawAdmin === true) adminVal = 1;
                else if (typeof rawAdmin === "number") adminVal = rawAdmin;
                else if (typeof rawAdmin === "string") {
                  const s = rawAdmin.toLowerCase();
                  if (s === "1" || s === "true" || s === "t" || s === "yes") adminVal = 1;
                }
                serverUser.admin = adminVal;
                setUser(serverUser);
                localStorage.setItem("user", JSON.stringify(serverUser));
              }
            }
          } catch {
            // ignore profile refresh errors silently
          }
        })();
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isLoggedIn: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
