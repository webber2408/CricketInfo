import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import Profile from "./components/profile";
import Topics from "./components/topics";
import TopicDetail from "./components/topicDetail";

import "./App.css";

const App = () => {
  return (
    <div className="main-wrapper">
      <div className="main-wrapper-overlay">
        <Navbar />
        <Router>
          <Switch>
            <Route path="/" exact>
              <Login />
            </Route>
            <Route path="/register" exact>
              <Register />
            </Route>
            <Route path="/profile" exact>
              <Profile />
            </Route>
            <Route path="/subscriptions" exact>
              <Topics />
            </Route>
            <Route path="/dashboard" exact>
              <Home />
            </Route>
            <Route path="/subscriptionDetails">
              <TopicDetail />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default App;
