import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Features from "./pages/Features.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar.jsx";
import About from "./pages/About.jsx";

function App() {
  return (
    <Router>

      <Navbar />   {/* Visible on all pages */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />   {/* Optional: also visible on all pages */}

    </Router>
  );
}

export default App;