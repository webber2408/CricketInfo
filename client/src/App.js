import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card from "./components/card/card";
import Navbar from "./components/navbar/navbar";

import { getAllMatches, getMatchStats } from "./slices/cricketSlice";

import { TEAMS } from "./team_config/config";

import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.cricket.matches);
  const matchStats = useSelector((state) => state.cricket.matchStats);

  useEffect(() => {
    dispatch(getAllMatches());
    dispatch(getMatchStats());
  }, []);

  useEffect(() => {
    console.log(matchStats);
  }, [matchStats]);

  console.log("matchStats", matchStats);

  return (
    <div className="main-wrapper">
      <div className="main-wrapper-overlay">
        <Navbar />
        <div className="main-wrapper__content">
          {Object.values(TEAMS).map((team) => {
            return (
              <Card
                team={team}
                matchStat={matchStats.find((item) => item.Name == team.title)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
