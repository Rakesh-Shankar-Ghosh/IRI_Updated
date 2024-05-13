import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./pages/Login";
import GetAllUsers from "./component/GetAllUsers";
import AuthContextProvider from "./context/AuthContext";
import SingleUser from "./component/SingleUser";

function App() {
  return (
    <ChakraProvider>
      <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/getall" element={<GetAllUsers />} />
          <Route path="/singleuser/:id" element={<SingleUser />} />
        </Routes>
      </Router>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
