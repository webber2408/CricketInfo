import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import "./card.css";

const getOptions = (wins, losses) => {
  return {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      marginTop: 0,
      marginBottom: 0,
      width: 300,
      height: 300,
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.percentage:.1f} %",
        },
      },
    },
    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
      return {
        radialGradient: {
          cx: 0.5,
          cy: 0.3,
          r: 0.7,
        },
        stops: [
          [0, color],
          [1, Highcharts.color(color).brighten(-0.3).get("rgb")], // darken
        ],
      };
    }),
    series: [
      {
        name: "MatchStats",
        colorByPoint: true,
        data: [
          {
            name: "Wins",
            y: wins,
            sliced: true,
            selected: true,
          },
          {
            name: "Losses",
            y: losses,
          },
        ],
      },
    ],
  };
};

const Card = ({ team, matchStat }) => {
  console.log(matchStat);
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={team.bg} />
        </div>
        <div className="flip-card-back">
          {matchStat ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={getOptions(matchStat.Wins, matchStat.Lost)}
            />
          ) : (
            <div className="no-matches">No Matches Played</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
