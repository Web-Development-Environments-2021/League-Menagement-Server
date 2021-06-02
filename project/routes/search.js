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

router.get("/players/:searchQuery/filter/:positionName", async(req, res, next)=>{
    try{
        searchPlayer = req.params.searchQuery;
        positionName = req.params.positionName;
        const player_filter_by_position = await players_utils.searchPlayersInfoByNameFilterByPosition(searchPlayer,positionName);
        res.send(player_filter_by_position);
    } catch(error){
        next(error);
    }
});

router.get("/players/:searchQuery/filter/:TeamName", async(req, res, next)=>{
    try{
        searchPlayer = req.params.searchQuery;
        team_name = req.params.TeamName;
        const player_filter_by_teamName = await players_utils.searchPlayersInfoByNameAndFilterByTeamName(searchPlayer, team_name);
        res.send(player_filter_by_teamName);
    } catch(error){
        next(error);
    }
});


router.get("/teams/:searchQuery", async (req, res, next) =>{
    try{
        console.log(req.params.searchQuery);
        const team_details = await teams_utils.searchTeamsInfoByName(req.params.searchQuery);
        res.send(team_details);
    }
    catch(error){
        next(error);
        // res.status(500).send('Team not found!')    
    }
});

module.exports = router;