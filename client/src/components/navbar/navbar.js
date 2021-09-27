import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";

import MatchForm from "../matchForm/matchForm";

import "./navbar.css";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  return {
    top: `10%`,
    left: `29%`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 600,
    height: 600,
    backgroundColor: "white",
    padding: "4px",
    outline: "none",
  },
}));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  return (
    <div>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <MatchForm onClose={() => setIsOpen(false)} />
        </div>
      </Modal>
      <nav>
        <ul>
          <li>Cricket Information System (IPL)</li>
          <li>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsOpen(true)}
            >
              Add Match
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
