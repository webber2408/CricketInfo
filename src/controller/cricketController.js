const Cricket = require("../model/cricket");

// CREATE
const addMatch = async (req, res) => {
    try{
        const matchData = JSON.parse(req.body);
        const result = new Cricket(matchData).save();
        if(result){
            return {
                success: 200,
                message: "Match Added Successfully"
            }
        }
    }catch (err){
        console.error("addMatch failed ", err);
        return {
            success: 400,
            message: "Unable to add match"
        }
    }
}

// READ
const getAllMatches = async (req, res) => {
    try{
        const query = Cricket.find({}); // MongoDB Query
        const result = await query.exec();
        if(result){
            return {
                success: 200,
                message: "All Matches Fetched",
                data: result
            }
        }else{
            return {
                success: 404,
                message: "No mathes found"
            }
        }
    }catch (err){
        console.error("getAllMatches failed ", err);
        return {
            success: 400,
            message: "getAllMatches error"
        }
    }
}

module.exports = {
    addMatch,
    getAllMatches
}