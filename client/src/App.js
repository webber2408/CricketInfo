import React from "react";

import Card from "./components/card/card";
import Navbar from "./components/navbar/navbar";

import "./App.css";

const App = () => {
  return (
    <div className="main-wrapper">
      <div className="main-wrapper-overlay">
        <Navbar />
        <div className="main-wrapper__content">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default App;
