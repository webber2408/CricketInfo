import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card from "./components/card/card";
import Navbar from "./components/navbar/navbar";

import { getAllMatches } from "./slices/cricketSlice";

import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.cricket.matches);

  useEffect(() => {
    dispatch(getAllMatches());
  }, []);

  useEffect(() => {
    console.log(matches);
  }, [matches]);

  console.log("MATCHES", matches);

  return (
    <div className="main-wrapper">
      <div className="main-wrapper-overlay">
        <Navbar />
        <div className="main-wrapper__content">
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
