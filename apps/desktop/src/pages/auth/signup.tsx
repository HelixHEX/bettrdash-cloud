import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../lib/providers/user";
// import { useState } from "react";
// import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function Signup() {
  const { user } = useContext(UserContext);

  if (user) return <Navigate to="/" />;

  return <>Signu Pages</>;
}
