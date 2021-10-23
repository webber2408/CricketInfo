import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card from "../card/card";

import { getAllMatches, getMatchStats } from "../../slices/cricketSlice";
import { TEAMS } from "../../team_config/config";

const Home = () => {
  const dispatch = useDispatch();
  const matchStats = useSelector((state) => state.cricket.matchStats);

  if (!sessionStorage.getItem("TOKEN")) {
    window.location.href = "/";
  }

  useEffect(() => {
    dispatch(getAllMatches());
    dispatch(getMatchStats());
  }, []);

  return (
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
  );
};

export default Home;
