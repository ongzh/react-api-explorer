import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ApiServiceDetail from "./pages/ApiServiceDetail";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/apiDetails/:provider/:apiService"
          element={<ApiServiceDetail />}
        />
        <Route path="/apiDetails/:provider" element={<ApiServiceDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
