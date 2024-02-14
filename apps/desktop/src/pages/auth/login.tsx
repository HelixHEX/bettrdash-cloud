import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../lib/providers/user";
// import { useState } from "react";
// import { useNavigate, Link as RouterLink } from "react-router-dom";

axios.defaults.withCredentials = false;

const Login = () => {
  const { user } = useContext(UserContext);

  return <>Login Page {user?.toString()}</>;
};

export default Login;
