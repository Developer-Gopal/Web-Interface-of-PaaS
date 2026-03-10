import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Home from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Features from "./pages/Features.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar.jsx";

function Layout() {
  const location = useLocation();

  const hideLayout = location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;