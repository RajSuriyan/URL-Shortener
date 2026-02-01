import { createContext } from "react";

export type AuthContextType = {
  loggedIn: boolean;
  loading:boolean;
  setLoggedIn: (v: boolean) => void;
  setLoading:(v:boolean) => void;
  userName:string;
  setUserName:(v:string) => void;

};

export const AuthContext = createContext<AuthContextType | null>(null);