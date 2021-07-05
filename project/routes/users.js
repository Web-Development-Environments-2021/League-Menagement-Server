var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const league_utils = require("./utils/league_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function(req, res, next) {
    if (req.session && req.session.user_id >= 0) {
        DButils.execQuery("SELECT user_id FROM dbo.users")
            .then((users) => {
                if (users.find((x) => x.user_id === req.session.user_id)) {
                    req.user_id = req.session.user_id;
                    next();
                }
            })
            .catch((err) => next(err));
    } else {
        res.sendStatus(401);
    }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/getFavoriteGames", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const game_ids = await users_utils.getFavoriteGames(user_id);
        let game_ids_array = [];
        game_ids.map((element) => game_ids_array.push(element.game_id));
        const results = await league_utils.getGameDetailsById(game_ids_array);
        if (results.length == 0) {
            res.status(203).send("There is no content to send for this request.");
        } else {
            res.status(200).send(results);
        }
    } catch (error) {
        next(error);
    }
});

router.post("/addFavoriteGames", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const game_id = req.body.game_id;
        const status = await users_utils.markGameAsFavorite(user_id, game_id);
        res.status(201).send(status);
    } catch (error) {
        res.status(204).send(error.message);
        // next(error);
    }
});

module.exports = router;