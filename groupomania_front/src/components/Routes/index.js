import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import Profil from "../../pages/Profil";
import Connection from "../../pages/Connection";

const index = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Connection />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default index;
