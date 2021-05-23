var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/team_utils");

router.get("/teamFullDetails/:teamId", async(req, res, next) => {
    let team_details = [];
    try {
        const team_player_details = await players_utils.getPlayersByTeam(req.params.teamId);
        const team_coach = await teams_utils.getCoachName(req.params.teamId);
        //we should keep implementing team page.....
        res.send(team_player_details);
    } catch (error) {
        next(error);
    }
});

router.get("/playerFullDetails/:playerId", async(req, res, next) => {
    try {
        const playerDetails = await players_utils.getPlayersInfo([req.params.playerId], true);
        res.send(playerDetails);
    } catch (error) {
        next(error);
    }
});

router.get("/coachFullDetails/:coachId", async(req, res, next) => {
    try {
        const coachDetails = await players_utils.getCoachesInfo([req.params.coachId], true);
        res.send(coachDetails);
    } catch (error) {
        next(error);
    }
});
router.get("/playerPreviewDetails/:playerId", async(req, res, next) => {
    try {
        const playerDetails = await players_utils.getPlayersInfo([req.params.playerId], false);
        res.send(playerDetails);
    } catch (error) {
        next(error);
    }
});

router.get("/coachPreviewDetails/:coachId", async(req, res, next) => {
    try {
        const coachDetails = await players_utils.getCoachesInfo([req.params.coachId], false);
        res.send(coachDetails);
    } catch (error) {
        next(error);
    }
});

module.exports = router;