var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/team_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
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

module.exports = router;
