import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authenticationSlice";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import swal from "sweetalert";

import "./login.css";

// LOGIN COMPLETE
const defaultValues = {
  userEmail: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(defaultValues);

  if (localStorage.getItem("TOKEN") && localStorage.getItem("USER_EMAIL")) {
    window.location.href = "/dashboard";
  }

  const handleInputChange = (e, customName = "") => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [customName || name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(formValues)).then(({ payload: { success } }) => {
      switch (success) {
        case 404:
          swal("User not found!", "Please register", "error");
          return;
        case 401:
          swal("Argh!", "Incorrect Password!", "error");
          return;
        case 500:
          swal("Argh!", "Login Failed, Please try again later", "error");
          return;
        case 200:
          // swal("Success!", "User logged in successfully!", "success");
          window.location.href = "/dashboard";
          return;
      }
    });
  };

  return (
    <div className="loginForm">
      <div className="heading">
        <h2>Login</h2>
      </div>
      <form onSubmit={handleSubmit} autoComplete={"off"}>
        <div className="form-labels">Email</div>
        <TextField
          id="name-input"
          name="userEmail"
          label=""
          type="email"
          variant="outlined"
          onChange={handleInputChange}
          className="textField"
          required
        />
        <div className="form-labels">Password</div>
        <TextField
          id="name-input"
          name="password"
          label=""
          type="password"
          variant="outlined"
          onChange={handleInputChange}
          className="textField"
          required
        />

        <div className="btn-wrapper">
          <Button variant="outlined" color="primary" type="submit">
            Submit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            type="submit"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Register Instead
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
