let express = require("express");
let router = express.Router();
const players_utils = require("./utils/players_utils");


router.use("/?q=", ()=>{
    var url = window.location.search;
    url = url.replace("?", ''); // remove the ?
    alert(url); //alerts ProjectID=462 is your case
});

router.get("/players/:id", async(req, res, next) =>{
    try{
        const player_details = await players_utils.getPlayersInfo();
    }
    catch(error){
        next(error);
    }
});

router.get("/teams/:id", async (req, res, next) =>{
    try{

    }
    catch(error){
        next(error);
    }
});

router.get("/coaches/:id", async (req, res, next) =>{
    try{
    const coach_details = await players_utils.getCoachesInfo();
    }
    catch(error){
        next(error);
    }
});
