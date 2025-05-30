import { createContext } from "react";

export type User = {
  email: string;
};

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<void>;
  refreshToken: () => Promise<boolean | undefined>;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | null>({
  user: null,
  token: null,
  loginUser: async () => {},
  logoutUser: async () => {},
  refreshToken: async () => undefined,
  isLoggedIn: false,
  loading: true,
  error: null,
});
