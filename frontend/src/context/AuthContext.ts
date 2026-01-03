import { createContext } from "react";

export type AuthContextType = {
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);