import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../slices/authenticationSlice";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import swal from "sweetalert";

import "./register.css";

const defaultValues = {
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(defaultValues);

  if (localStorage.getItem("TOKEN")) {
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
    dispatch(register(formValues)).then(({ payload: { success } }) => {
      switch (success) {
        case 404:
          swal("Argh!", "Please supply all information", "error");
          return;
        case 422:
          swal("Argh!", "User already registered, please login", "error");
          return;
        case 500:
          swal("Argh!", "Login Failed, Please try again later", "error");
          return;
        case 200:
          swal(
            "Success!",
            "User registered successfully, go to Login!",
            "success"
          );
          // window.location.href = "/dashboard";
          return;
      }
    });
  };

  return (
    <div className="loginForm">
      <div className="heading">
        <h2>Register</h2>
      </div>
      <form onSubmit={handleSubmit} autoComplete={"off"}>
        <div className="form-labels">Name</div>
        <TextField
          id="name-input"
          name="name"
          label=""
          type="name"
          variant="outlined"
          onChange={handleInputChange}
          className="textField"
          required
        />
        <div className="form-labels">Email</div>
        <TextField
          id="name-input"
          name="email"
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
              window.location.href = "/";
            }}
          >
            Login Instead
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
