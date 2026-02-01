import * as React from "react";
import api from "../api";
import { AuthContext } from "./AuthContextType";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [userName,setUserName] = React.useState("");

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/me"); // auth endpoint
        if (res.status === 200) {
          setLoggedIn(true);
          setUserName(res.data.userName)
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    loggedIn,
    setLoggedIn,
    loading,
    setLoading,
    userName,
    setUserName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
