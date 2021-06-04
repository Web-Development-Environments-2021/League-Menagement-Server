var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const { getLeagueDetails } = require("./utils/league_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/team_utils");
const league_utils = require("./utils/league_utils");

router.get("/teamFullDetails/:teamId", async(req, res, next) => {
    let team_details = [];
    try {
        const { team_name, players_info } = await players_utils.getPlayersByTeam(req.params.teamId);
        const team_coach = await teams_utils.getCoachName(req.params.teamId);
        const past_games = await league_utils.getPastGameDetailsByTeam(team_name);
        const futur_games = await league_utils.getFutureGameDetailsByTeam(team_name);
        res.send({ coach: team_coach, squad: players_info, pastGames: past_games, futurGames: futur_games });
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

router.get("/playerFullDetails/:playerId", async(req, res, next) => {
    try {
        const playerDetails = await players_utils.getPlayersInfo([req.params.playerId], true);
        res.send(playerDetails);
    } catch (error) {
        next(error);
    }
});

router.get("/coachPreviewDetails/:coachId", async(req, res, next) => {
    try {
        const coachDetails = await players_utils.getCoachesInfo([req.params.playerId], false);
        res.send(coachDetails);
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

// router.get("/getAllTeamsByCountry/:COUNTRY_ID", async(req, res, next) => {
//     try {
//         const teamsNames = await teams_utils.getAllTeamsByCountry(req.params.COUNTRY_ID);
//         res.send(teamsNames);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = router;