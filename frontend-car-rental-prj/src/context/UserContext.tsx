import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

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
    setUser(loginData.user);
    setToken(loginData.token);

    localStorage.setItem("user", JSON.stringify(loginData.user));
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
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
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
