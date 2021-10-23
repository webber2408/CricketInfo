import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserProfile, toggleAdvertisement } from "../../slices/userSlice";
import Button from "@material-ui/core/Button";
import { resetAdvertisement } from "../../slices/topicSlice";

import "./profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const [adsVisible, setAdsVisible] = useState(
    localStorage.getItem("showAds") == "true"
  );
  const [user, setUser] = useState(null);

  if (!localStorage.getItem("USER_EMAIL") || !localStorage.getItem("TOKEN")) {
    localStorage.removeItem("TOKEN");
    window.location.href = "/";
  }

  useEffect(() => {
    dispatch(getUserProfile(localStorage.getItem("USER_EMAIL"))).then(
      ({ payload }) => {
        if (payload.email) {
          setUser(payload);
        }
      }
    );
  }, []);

  const stopAds = () => {
    dispatch(
      toggleAdvertisement({
        email: localStorage.getItem("USER_EMAIL"),
        value: false,
      })
    );
    dispatch(resetAdvertisement());
    setAdsVisible(false);
  };

  const startAds = () => {
    dispatch(
      toggleAdvertisement({
        email: localStorage.getItem("USER_EMAIL"),
        value: true,
      })
    );
    setAdsVisible(true);
  };

  return (
    <div className="profile">
      <div className="profile_heading">
        <h2>Profile</h2>
      </div>
      {user && <h3>{user.name}</h3>}
      {user && <h3>{user.email}</h3>}
      {adsVisible ? (
        <Button size="large" color="secondary" onClick={stopAds}>
          Stop Receiving Ads?
        </Button>
      ) : (
        <Button size="large" color="primary" onClick={startAds}>
          Start Receiving Ads?
        </Button>
      )}
    </div>
  );
};

export default Profile;
