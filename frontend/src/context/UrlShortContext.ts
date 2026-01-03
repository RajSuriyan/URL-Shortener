import { createContext } from "react";

export type URLShortContext = {
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<URLShortContext | null>(null);