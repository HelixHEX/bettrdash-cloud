import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Providers from "./lib/providers";
import reportWebVitals from "./reportWebVitals";

/* Pages */
import Dashboard from "./pages/dashboard";
import Monitor from './pages/monitor'

/* Auth */
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";

/* Layouts */
import RootLayout from "./layouts";
import Overview from "./pages/overview";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Router>
      <Providers>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='/projects/:projectId' element={<Overview />} />
            <Route path='/projects/:projectId/monitor' element={<Monitor />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Signup" element={<SignupPage />} />
        </Routes>
      </Providers>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
