let express = require("express");
let router = express.Router();
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/team_utils");
const auth_utils = require("./utils/auth_utils");


// router.use("", async function(req, res, next) {
//     let status = auth_utils.get_curr_user_login_permoission()
//     if(status == null){
//         next();
//         // req.url = req.url.replace('/search/', '');
//         // console.log(req.url);
//     }
//     else{
//         res.sendStatus(401);
//     }
// });

router.get("/players/:searchQuery", async(req, res, next) => {
    try {
        const player_details = await players_utils.searchPlayersInfoByName(req.params.searchQuery);
        res.send(player_details);
    } catch (error) {
        next(error);
    }
});

router.get("/players/:searchQuery/filterByPosition/:positionName", async(req, res, next)=>{
    try{
        searchPlayer = req.params.searchQuery;
        positionName = req.params.positionName;
        const player_filter_by_position = await players_utils.searchPlayersInfoByNameFilterByPosition(searchPlayer,positionName);
        // res.send(player_filter_by_position);
        if(player_filter_by_position.length > 0){
            res.send(player_filter_by_position);
        }
        else{
            res.sendStatus(204);
        }
    } catch(error){
        next(error);
    }
});

router.get("/players/:searchQuery/filterByTeam/:teamName", async(req, res, next)=>{
    try{
        let searchPlayer = req.params.searchQuery;
        
        let team_name = req.params.teamName;
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
        if(team_details.length > 0){
            res.send(team_details);
        }
        else{
            console.log('Team not found!');
            res.status(204).send("Team not found!");
        }
    }
    catch(error){
        next(error);
        // res.status(500).send('Team not found!')    
    }
});

module.exports = router;