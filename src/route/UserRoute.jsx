import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

export default function UserRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/users/auth-check`
      );
      // var {accessToken} = res.data;
      

      // const result = await axios.post(
      //   `${process.env.REACT_APP_API}/users/request-refresh-token`, {accessToken}
      // );
      // var {newAccessToken}=result.data;
      
      
      // accessToken = newAccessToken;

      // console.log('AccessToken is:', accessToken);
      // console.log('\nNew AccessToken is:', accessToken);

      
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: res.data.user,
        accessToken: res.data.accessToken
      }));
    

      if (res.data.success) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.accessToken) authCheck();
  }, [auth?.accessToken]);

  return ok ? <Outlet /> : <Spinner path="" />;
}
