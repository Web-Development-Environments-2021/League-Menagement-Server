let express = require("express");
let router = express.Router();
const players_utils = require("./utils/players_utils");
let object_to_search = "";

// var url = "http://www.example.com/index.php?myParam=384&login=admin"; // or window.location.href for current url
// var captured = /myParam=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
// var result = captured ? captured : 'myDefaultValue';



router.get("/players/:searchQuery", async(req, res, next) =>{
    try{
        const player_details = await players_utils.searchPlayersInfoByName(req.params.searchQuery);
        res.send(player_details);
    }
    catch(error){
        next(error);
    }
});

// router.get("/teams/:searchQuery", async (req, res, next) =>{
//     try{

//     }
//     catch(error){
//         next(error);
//     }
// });

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