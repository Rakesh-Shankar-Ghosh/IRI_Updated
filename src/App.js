import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./pages/Login";
import GetAllUsers from "./component/GetAllUsers";

import SingleUser from "./component/SingleUser";
import { AuthProvider } from "./context/AuthContext";
import UserRoute from "./route/UserRoute";
import EditUser from "./component/EditUser";
import ChangePassword from "./component/ChangePassword";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/profile/" element={<UserRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/getall" element={<GetAllUsers />} />
              <Route path="dashboard/edit-user" element={<EditUser />} />
              <Route path="dashboard/change-password" element={<ChangePassword/>} />
              <Route path="dashboard/singleuser/:id" element={<SingleUser />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;


