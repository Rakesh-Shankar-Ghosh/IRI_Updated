// import React, { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";

// // Create AuthContext
// export const AuthContext = createContext();

// // Helper function to fetch user data using the accessToken
// export const fetchUserData = async (accessToken) => {
//   try {
//     const res = await axios.post(`${process.env.REACT_APP_API}/users/get-login-user`, { accessToken });
//     return res.data;
//   } catch (error) {
//     console.error("Failed to fetch user data:", error);
//     return null;
//   }
// };

// // Create AuthProvider component
// const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({ user: null, accessToken: "" });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const accessToken = JSON.parse(localStorage.getItem("auth")); // For demonstration purposes
//       if (accessToken) {
//         const data = await fetchUserData(accessToken);
//         if (data) {
//           setAuth({ user: data.user, accessToken });
//           axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
//         }
//       }
//       setLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   // Function to set the auth state and optionally store it in local storage
//   const setAuthState = (newAuthState) => {
//     setAuth(newAuthState);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${newAuthState.accessToken}`;
//     // For demonstration purposes
//     // localStorage.setItem("auth", JSON.stringify(newAuthState.accessToken));
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Show a loading indicator while loading
//   }

//   return (
//     <AuthContext.Provider value={[auth, setAuthState]}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the AuthContext
// const useAuth = () => useContext(AuthContext);

// export { useAuth, AuthProvider };

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create AuthContext
export const AuthContext = createContext();

// Create AuthProvider component
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, accessToken: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = JSON.parse(localStorage.getItem("auth")); // For demonstration purposes
      if (accessToken) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          accessToken,
        }));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Function to set the auth state and optionally store it in local storage
  const setAuthState = (newAuthState) => {
    setAuth(newAuthState);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newAuthState.accessToken}`;
    // For demonstration purposes
    // localStorage.setItem("auth", JSON.stringify(newAuthState.accessToken));
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while loading
  }

  return (
    <AuthContext.Provider value={[auth, setAuthState]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
