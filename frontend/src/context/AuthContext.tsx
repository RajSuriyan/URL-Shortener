import * as React from "react";
import { AuthContext } from "./AuthContextType";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const value = { loggedIn, setLoggedIn, loading, setLoading };

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
}


