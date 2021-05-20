const axios = require("axios");
//const DButils = require("../routes/utils/DButils");
const LEAGUE_ID = 271;
const today = new Date();
const STARTDATE = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const ENDATEFUTURE = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+3);
const ENDATEPAST = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-3);

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
  };
}

//CurrentCycleGames


async function getPastGameDetails(){
  const fixtures = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/fixtures/between/${ENDATEPAST}/${STARTDATE}`,
    {
      params: {
        leagues: LEAGUE_ID, 
        include: "venue, league, events.player",
        api_token: process.env.api_token,
      },
    }
  );

  //next game details should come from DB
  return extractRelevantGameData(fixtures, true);

}

async function getFutureGameDetails(){
  const fixtures = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/fixtures/between/${STARTDATE}/${ENDATEFUTURE}`,
    {
      params: {
        leagues: LEAGUE_ID,
        include: "venue, league, events.player",
        api_token: process.env.api_token,
      },
    }
  );
  // next game details should come from DB
  return extractRelevantGameData(fixtures, false);

}

const extractRelevantGameData = async (fixtures,isPastGame)=> {
  let list_of_info = [];
  let game_info = {}; 
  console.log(fixtures.data.data.length);
  for(let i=0; i<fixtures.data.data.length; i++){  

    const home_team = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/${fixtures.data.data[i].localteam_id}/`,
      {
        params: {
          include: "Teams",
          api_token: process.env.api_token,
        },
      }
    );
    const away_team = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/${fixtures.data.data[i].visitorteam_id}`,
      {
        params: {
          include: "Teams",
          api_token: process.env.api_token,
        },
      }
    );

    game_info={
      date: fixtures.data.data[i].time.starting_at.date,
      time: fixtures.data.data[i].time.starting_at.time,
      league_name: fixtures.data.data[i].league.data.name,
      home_team_name: home_team.data.data.name,
      away_team_name: away_team.data.data.name,
      home_score: fixtures.data.data[i].scores.localteam_score,
      away_score: fixtures.data.data[i].scores.visitorteam_score,
      filed: fixtures.data.data[i].venue.data.name,
      
    };
    if(isPastGame){
      //event sechulde
      // for(let j=0; j<fixtures.data.data[i].events.data; j++){
      //   player_name : fixtures.data.data[i].events.data[j].player_name,
      //   type: fixtures.data.data[i].events.data[j].type,
      // }

      game_info["winner"] = fixtures.data.data[i].winner_team_id;
      game_info["events_schedule"]= fixtures.data.data[i].events.data;

    } 

    // // add the past Games
    // await DButils.execQuery(
    // `INSERT INTO dbo.games ('${game_info.keys()}') VALUES ('${game_info.value()}')`
    // );

    list_of_info.push(game_info);
  };

  

  return list_of_info;
};
  
exports.getLeagueDetails = getLeagueDetails;
exports.getPastGameDetails = getPastGameDetails;
exports.getFutureGameDetails = getFutureGameDetails;
