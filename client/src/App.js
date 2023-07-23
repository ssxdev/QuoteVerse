import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./pages/Form";
import Home from "./pages/Home";
import Quote from "./pages/Quote";
import NoPage from "./pages/NoPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="quote" element={<Quote />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="login" element={<Form isLogin={true} />} />
        <Route path="register" element={<Form isLogin={false} />} />
      </Routes>
    </BrowserRouter>
  );
}
