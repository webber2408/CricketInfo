import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";

import MatchForm from "../matchForm/matchForm";

import "./navbar.css";

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
  const isAdmin = window.location.pathname == "/dashboard-admin";
  const isDashboard = window.location.pathname == "/dashboard";
  const isProfile = window.location.pathname == "/profile";

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
          {isAdmin && (
            <li>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsOpen(true)}
              >
                Add Match
              </Button>
            </li>
          )}
          {isDashboard && (
            <>
              <li>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                >
                  Profile
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    localStorage.removeItem("TOKEN");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </li>
            </>
          )}
          {isProfile && (
            <>
              <li>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                >
                  Dashboard
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    localStorage.removeItem("TOKEN");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
