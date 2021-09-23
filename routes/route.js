const CricketController = require("../src/controller/cricketController");

const routes = [
    {
        method: 'POST',
        url: '/api/cricket',
        handler: CricketController.addMatch
    },
    {
        method: 'GET',
        url: '/api/cricket/all',
        handler: CricketController.getAllMatches
    }
]

module.exports = {
    routes
}
