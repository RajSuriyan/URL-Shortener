import * as React from "react";
import { AuthContext, AuthContextType } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = React.useState(false);

  const logout = () => setLoggedIn(false);

  const value: AuthContextType = { loggedIn, setLoggedIn, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
