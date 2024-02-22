import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../lib/providers/user";

export default function Login() {
  const { user } = useContext(UserContext);

  if (user) return <Navigate to="/" />;

  return <>Login Pages</>;
}
