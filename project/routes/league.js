var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const auth_utils = require("./utils/auth_utils");

router.use("", async function(req, res, next) {
    let status = auth_utils.get_curr_user_login_permoission()
    if (status == null) {
        res.sendStatus(401);
    } else {
        next();
    }
});

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
        const game_details = await league_utils.getPastGameDetails();
        res.send(game_details);
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


router.use("", async function(req, res, next) {
    let status = auth_utils.get_curr_user_login_permoission()
    if (status) {
        next();
    } else {
        if (status == null) {
            res.sendStatus(401);
        } else if (status == false) {
            res.sendStatus(403);
        }
    }
});

router.get("/add&getRandFutureGames", async(req, res, next) => {
    try {
        const game_details = await league_utils.getFutureGameDetailsFromAPI();
        res.send(game_details);
    } catch (error) {
        next(error);
    }
});

router.get("/add&getRandPastGames", async(req, res, next) => {
    try {
        const game_details = await league_utils.getPastGameDetailsFromAPI();
        res.send(game_details);
    } catch (error) {
        next(error);
    }
});

router.post("/addNewLeague", async(req, res, next) => {
    try {
        await league_utils.createNewLeague(req.body.league_name);
        // const league_details = await league_utils.addDetailsToLeague();
        res.status(201).send("ok");
    } catch (error) {
        next(error);
    }
});

router.get("/getAllreferees", async(req, res, next) => {
    try {
        const free_referee = await league_utils.getAllreferees();
        res.send(free_referee);
    } catch (error) {
        next(error);
    }
})

router.post("/addReferee", async(req, res, next) => {
    try {
        const result = await league_utils.addReferee(req.body.firstName, req.body.lastName, req.body.qualification);
        res.send(result);
    } catch (error) {
        // next(error);
        console.log(error);
        res.status(404).send("something went wrong cannot add new referee")
    }
})

router.post("/insertNewGame", async(req, res, next) => {
    try {
        const new_game_details = await league_utils.insertNewGame(
            req.body.date,
            req.body.time,
            req.body.league_name,
            req.body.home_team_name,
            req.body.away_team_name,
            req.body.field,
            req.body.referee
        );
        res.send(new_game_details);
    } catch (error) {
        next(error);
    }
});

module.exports = router;