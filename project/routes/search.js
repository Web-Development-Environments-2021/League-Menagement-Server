let express = require("express");
let router = express.Router();
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/team_utils");

router.get("/players/:searchQuery", async(req, res, next) => {
    try {
        const player_details = await players_utils.searchPlayersInfoByName(req.params.searchQuery);
        res.send(player_details);
    } catch (error) {
        next(error);
    }
});

router.get("/teams/:searchQuery", async (req, res, next) =>{
    try{
        const team_details = await teams_utils.searchTeamsInfoByName(req.params.searchQuery);
        res.send(team_details);
    }
    catch(error){
        next(error);
    }
});

// router.use("/coaches", async (req, res, next) =>{
//     try{
//     const coach_details = await players_utils.getCoachesInfo();
//     res.send(coach_details);
//     }
//     catch(error){
//         next(error);
//     }
// });


module.exports = router;