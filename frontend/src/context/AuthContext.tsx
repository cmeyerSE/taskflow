import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  signup as signupRequest,
} from "../services/authService";

type User = {
  id: number;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isValidUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;

  const user = value as User;

  return (
    typeof user.id === "number" &&
    user.id > 0 &&
    typeof user.email === "string" &&
    user.email.trim().length > 0
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();

        if (isValidUser(currentUser)) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading current user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);

    if (isValidUser(data.user)) {
      setUser(data.user);
    } else {
      setUser(null);
      throw new Error("Invalid user data received from server");
    }
  };

  const signup = async (
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    const data = await signupRequest(email, password, passwordConfirmation);
    if (isValidUser(data.user)) {
      setUser(data.user);
    } else {
      setUser(null);
      throw new Error("Signup response did  not include a valid user");
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}