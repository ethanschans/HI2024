import Main from "pages/Main";
import Query from "pages/Query";
import React from "react";
import { Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/query" element={<Query />}/>
    </Routes>
  );
}
