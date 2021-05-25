var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const auth_utils = require("./utils/auth_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.get("/getPastGame", async (req, res, next) => {
  try {
    const game_details = await league_utils.getPastGameDetails();
    res.send(game_details);
  } catch (error) {
    next(error);
  }
});

router.use("", async function (req, res, next) { 
  if((auth_utils.get_curr_user_login_permoission())){
    console.log(true);
    next();
  }
  else{
    console.log(false);
    res.sendStatus(401); 
  }
});

router.get("/getFutureGameFromAPI", async (req, res, next) => {
  try {
    const game_details = await league_utils.getFutureGameDetailsFromAPI();
    res.send(game_details);
  } catch (error) {
    next(error);
  }
});

router.post("/addNewLeague/:league_name", async (req, res, next) => {
  try {    
    const league = await league_utils.createNewLeague(req.body.league_name);
    // const league_details = await league_utils.addDetailsToLeague();
    res.send(league);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

/*
TODO: dsfdfsdfsfd
*/
