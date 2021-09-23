const Cricket = require("../model/cricket");
const { v4: uuidv4 } = require("uuid");

// CREATE
const addMatch = async (req, res) => {
  try {
    const matchData = JSON.parse(req.body);
    matchData.matchId = uuidv4();
    const query = Cricket.find({
      team1: matchData.team1,
      team2: matchData.team2,
      date: matchData.date,
    });
    const isDuplicate = await query.exec();
    if (isDuplicate[0]) {
      return {
        success: 422,
        message:
          "There already exists a match between the given teams on the specified date.",
      };
    }
    const savingData = new Cricket(matchData).save();

    if (savingData) {
      return {
        success: 200,
        message: "Match Added Successfully",
      };
    }
  } catch (err) {
    console.error("addMatch failed ", err);
    return {
      success: 400,
      message: "Unable to add match",
    };
  }
};

// READ
const getAllMatches = async (req, res) => {
  try {
    const query = Cricket.find({}); // MongoDB Query
    const result = await query.exec();
    if (result) {
      return {
        success: 200,
        message: "All Matches Fetched",
        data: result,
      };
    } else {
      return {
        success: 404,
        message: "No mathes found",
      };
    }
  } catch (err) {
    console.error("getAllMatches failed ", err);
    return {
      success: 400,
      message: "getAllMatches error",
    };
  }
};

// Update Match Details
const updateMatchDetails = async (req, res) => {
  try {
    const query = Cricket.findOneAndUpdate(
      { matchId: req.params.matchId },
      JSON.parse(req.body)
    );
    const result = await query.exec();
    if (result) {
      return {
        success: 200,
        message: "Successfully updated match details",
      };
    }
    return {
      success: 404,
      message: "No match found with the given match id",
    };
  } catch (err) {
    console.error(err);
    return {
      success: 400,
      message: "Unable to update match details",
    };
  }
};

// Delete Match Details
const deleteMatchDetails = async (req, res) => {
  try {
    const query = Cricket.findOneAndDelete(
      { matchId: req.params.matchId },
      JSON.parse(req.body)
    );
    const result = await query.exec();
    if (result) {
      return {
        success: 200,
        message: "Successfully deleted match details",
      };
    }
    return {
      success: 400,
      message: "Unable to delete match details",
    };
  } catch (err) {
    console.error(err);
    return {
      success: 400,
      message: "Unable to delete match details",
    };
  }
};
module.exports = {
  addMatch,
  getAllMatches,
  updateMatchDetails,
  deleteMatchDetails,
};
