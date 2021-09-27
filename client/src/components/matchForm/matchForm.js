import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import swal from "sweetalert";

import { useDispatch } from "react-redux";
import { addMatch, getMatchStats } from "../../slices/cricketSlice";

import "./matchForm.css";
import { FormControl, InputLabel, MenuItem } from "@material-ui/core";

const defaultValues = {
  city: "",
  date: "",
  player_of_match: "",
  team1: "",
  team2: "",
  winner: "",
};

const MatchForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e, customName = "") => {
    const { name, value } = e.target;
    console.log(name, value, customName);
    setFormValues({
      ...formValues,
      [customName || name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addMatch(formValues)).then(
      ({
        payload: {
          data: { success },
        },
      }) => {
        dispatch(getMatchStats());
        switch (success) {
          case 422:
            swal(
              "Watch out!",
              "There already exists a match for one of the teams on the specified date.",
              "warning"
            );
            return;
          case 400:
            swal("Argh!", "Unable to add match!", "error");
            return;
          case 200:
            swal("Success!", "Match Added Successfully!", "success");
            return;
        }
      }
    );
    onClose();
  };

  return (
    <div className="matchForm">
      <form onSubmit={handleSubmit} autoComplete={"off"}>
        <div className="form-labels">Team 1</div>
        <FormControl className={"textField"} variant="outlined" required>
          <Select
            value={formValues.team1}
            onChange={(e) => handleInputChange(e, "team1")}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"DC"}>Delhi Capitals (DC)</MenuItem>
            <MenuItem value={"CSK"}>Chennai Super Kings (CSK)</MenuItem>
            <MenuItem value={"RR"}>Rajasthan Royals (RR)</MenuItem>
            <MenuItem value={"MI"}>Mumbai Indians (MI)</MenuItem>
            <MenuItem value={"PBKS"}>Punjab Kings (PBKS)</MenuItem>
            <MenuItem value={"SRH"}>Sunrisers Hyderabad (SRH)</MenuItem>
            <MenuItem value={"KKR"}>Kolkata Knight Riders (KKR)</MenuItem>
            <MenuItem value={"RCB"}>Royal Challengers Bangalore (RCB)</MenuItem>
          </Select>
        </FormControl>
        <div className="form-labels">Team 2</div>
        <FormControl className={"textField"} variant="outlined" required>
          <Select
            value={formValues.team2}
            onChange={(e) => handleInputChange(e, "team2")}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"DC"}>Delhi Capitals (DC)</MenuItem>
            <MenuItem value={"CSK"}>Chennai Super Kings (CSK)</MenuItem>
            <MenuItem value={"RR"}>Rajasthan Royals (RR)</MenuItem>
            <MenuItem value={"MI"}>Mumbai Indians (MI)</MenuItem>
            <MenuItem value={"PBKS"}>Punjab Kings (PBKS)</MenuItem>
            <MenuItem value={"SRH"}>Sunrisers Hyderabad (SRH)</MenuItem>
            <MenuItem value={"KKR"}>Kolkata Knight Riders (KKR)</MenuItem>
            <MenuItem value={"RCB"}>Royal Challengers Bangalore (RCB)</MenuItem>
          </Select>
        </FormControl>
        <div className="form-labels">Match Date</div>
        <TextField
          id="name-input"
          name="date"
          label=""
          type="date"
          variant="outlined"
          defaultValue="2021-09-20"
          value={formValues.date}
          onChange={handleInputChange}
          className="textField"
          required
        />
        <div className="form-labels">Player of the match</div>
        <TextField
          id="name-input"
          name="player_of_match"
          label=""
          type="text"
          variant="outlined"
          value={formValues.player_of_match}
          onChange={handleInputChange}
          className="textField"
          required
        />
        <div className="form-labels">Winner</div>
        <TextField
          id="name-input"
          name="winner"
          type="text"
          variant="outlined"
          value={formValues.winner}
          onChange={handleInputChange}
          className="textField"
          required
        />
        <div className="form-labels">Match City</div>
        <TextField
          id="name-input"
          name="city"
          label=""
          type="text"
          variant="outlined"
          value={formValues.city}
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
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MatchForm;
