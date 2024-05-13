import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create AuthContext
export const AuthContext = createContext();

// Create AuthContextProvider component
const AuthContextProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken] = useState(null);

  // Update axios default headers when token changes
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token;
  }, [token]);

  // Function to set the token
  const setAuthToken = (newToken) => {
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
