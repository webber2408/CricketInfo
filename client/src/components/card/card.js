import React from "react";
import "./card.css";

const Card = () => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div class="flip-card-front">
          <div className="size_max">RCB</div>
          <div>Vs</div>
          <div className="size_max">CSK</div>
        </div>
        <div class="flip-card-back">
          <h1>John Doe</h1>
          <p>Architect & Engineer</p>
          <p>We love that guy</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
