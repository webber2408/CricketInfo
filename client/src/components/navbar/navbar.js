import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
} from "@material-ui/core";

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
  list: {
    width: "280px",
  },
}));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const isAdmin = window.location.pathname == "/dashboard-admin";
  const isDashboard = window.location.pathname == "/dashboard";
  const isProfile = window.location.pathname == "/profile";
  const isTopics = window.location.pathname == "/subscriptions";
  const isSubscriptionsPage = window.location.pathname.includes(
    "/subscriptionDetails"
  );

  const toggleDrawer = (open) => setIsDrawerOpen(open);

  const sideList = (
    <div className={classes.list}>
      <List>
        <ListItem
          button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          <ListItemText primary={"Dashboard"} />
        </ListItem>
        <ListItem
          button
          onClick={() => (window.location.href = "/subscriptions")}
        >
          <ListItemText primary={"Subscriptions"} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            window.location.href = "/profile";
          }}
        >
          <ListItemText primary={"Profile"} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            sessionStorage.removeItem("TOKEN");
            window.location.href = "/";
          }}
        >
          <ListItemText primary={"Logout"} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <MatchForm onClose={() => setIsOpen(false)} />
        </div>
      </Modal>
      <SwipeableDrawer
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
          style={{ paddingTop: "100px" }}
        >
          {sideList}
        </div>
      </SwipeableDrawer>
      <nav>
        <ul>
          {(isDashboard ||
            isProfile ||
            isTopics ||
            isAdmin ||
            isSubscriptionsPage) && (
            <li>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => toggleDrawer(true)}
              >
                Menu
              </Button>
            </li>
          )}
          <li>Cricket Information System</li>
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
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
