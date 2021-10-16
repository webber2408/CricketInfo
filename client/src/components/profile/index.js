import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserProfile } from "../../slices/userSlice";

import "./profile.css";

const Profile = () => {
  const dispatch = useDispatch();
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

  return (
    <div className="profile">
      <div className="profile_heading">
        <h2>Profile</h2>
      </div>
      {user && <h3>{user.name}</h3>}
      {user && <h3>{user.email}</h3>}
    </div>
  );
};

export default Profile;
