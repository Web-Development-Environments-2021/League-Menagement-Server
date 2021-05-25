var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

router.get("/getDetails", async(req, res, next) => {
    try {
        const league_details = await league_utils.getLeagueDetails();
        res.send(league_details);
    } catch (error) {
        next(error);
    }
});

router.get("/getPastGame", async(req, res, next) => {
    try {
        const league_details = await league_utils.getPastGameDetails();
        res.send(league_details);
    } catch (error) {
        next(error);
    }
});

router.get("/getFutureGame", async(req, res, next) => {
    try {
        const league_details = await league_utils.getFutureGameDetails();
        res.send(league_details);
    } catch (error) {
        next(error);
    }
});

router.post("/insertNewGame/:date/:time/:league_name/:home_team_name/:away_team_name/:field", async(req, res, next) => {
    try {
        const new_game_details = await league_utils.insertNewGame(req.params.date,
            req.params.time,
            req.params.league_name,
            req.params.home_team_name,
            req.params.away_team_name,
            req.params.field);
        res.send(new_game_details);
    } catch (error) {
        next(error);
    }
});

module.exports = router;