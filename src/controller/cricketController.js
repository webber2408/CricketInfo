const Cricket = require("../model/cricket");
const { v4: uuidv4 } = require("uuid");

// CREATE
const addMatch = async (req, res) => {
  try {
    const matchData = JSON.parse(req.body);
    matchData.matchId = uuidv4();
    const query1 = Cricket.find({
      team1: matchData.team1,
      date: matchData.date,
    });
    const query2 = Cricket.find({
      team2: matchData.team2,
      date: matchData.date,
    });
    const isDuplicate1 = await query1.exec();
    const isDuplicate2 = await query2.exec();

    if (isDuplicate1[0] || isDuplicate1[0]) {
      return {
        success: 422,
        message:
          "There already exists a match for one of the teams on the specified date.",
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

//

// READ
const getAllMatches = async (req, res) => {
  try {
    const query = Cricket.find({}); // MongoDB Query
    const result = await query.exec();
    var winCount = {};
    var lossCount = {};
    var totalMatches = {};
    const listOfTeams = new Set();
    for (var i = 0; i < result.length; i++) {
      console.log(result);
      if (result[i].winner == result[i].team1) {
        winner = result[i].team1;
        loser = result[i].team2;
      } else {
        winner = result[i].team2;
        loser = result[i].team1;
      }
      listOfTeams.add(winner);
      listOfTeams.add(loser);
      winCount[winner] = (winCount[winner] || 0) + 1;
      totalMatches[winner] = (totalMatches[winner] || 0) + 1;
      totalMatches[loser] = (totalMatches[loser] || 0) + 1;
      winCount[loser] = winCount[loser] || 0;
    }
    var summary = [];
    console.log(listOfTeams);
    for (let team of listOfTeams) {
      var data = {
        Name: team,
        Wins: winCount[team] / totalMatches[team],
        Lost: (totalMatches[team] - winCount[team]) / totalMatches[team],
        Total: totalMatches[team],
      };
      summary.push(data);
    }

    console.log(summary);

    if (result) {
      return {
        success: 200,
        message: "All Matches Fetched",
        data: summary,
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
