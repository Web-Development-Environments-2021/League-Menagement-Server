const axios = require("axios");
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
        include: "venue, league",
        api_token: process.env.api_token,
      },
    }
  );
  return extractRelevantGameData(fixtures,false);
  // return{
    //league_data: fixtures.data.data.length,
    // date: fixtures.data.data.time.starting_at.date,
    // time: fixtures.data.data[1].time.starting_at.time,
    // league_name: fixtures.data.data[1].league.data.name,
    // home_team_name: home_team.data.data.name,
    // away_team_name: away_team.data.data.name,
    // winner: fixtures.data.data[1].winner_team_id,
    // home_score: fixtures.data.data[1].scores.localteam_score,
    // away_score: fixtures.data.data[1].scores.visitorteam_score,
    // filed: fixtures.data.data[1].venue.data.name,
    //next game details should come from DB
  // }
  
}

async function getFutureGameDetails(){
  const fixtures = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/fixtures/between/${STARTDATE}/${ENDATEFUTURE}`,
    {
      params: {
        leagues: LEAGUE_ID,
        include: "venue, league",
        api_token: process.env.api_token,
      },
    }
  );


  // const home_team = await axios.get(
  //   `https://soccer.sportmonks.com/api/v2.0/teams/${fixtures.data.data[0].localteam_id}/`,
  //   {
  //     params: {
  //       include: "Teams",
  //       api_token: process.env.api_token,
  //     },
  //   }
  // );

  // const away_team = await axios.get(
  //   `https://soccer.sportmonks.com/api/v2.0/teams/${fixtures.data.data[0].visitorteam_id}`,
  //   {
  //     params: {
  //       include: "Teams",
  //       api_token: process.env.api_token,
  //     },
  //   }
  // );

  return extractRelevantGameData(fixtures, true);
  // {
  //   //league_data: livescores.data.data,
  //   date: fixtures.data.data[0].time.starting_at.date,
  //   time: fixtures.data.data[0].time.starting_at.time,
  //   league_name: fixtures.data.data[0].league.data.name,
  //   home_team_name: home_team.data.data.name,
  //   away_team_name: away_team.data.data.name,
  //   filed: fixtures.data.data[0].venue.data.name,

  //   // winner: livescores.data.data[0].winner_team_id,
  //   // home_score: livescores.data.data[0].scores.localteam_score,
  //   // away_score: livescores.data.data[0].scores.visitorteam_score,
  //   // next game details should come from DB
  // };
}

const extractRelevantGameData = async (fixtures,isFuture)=> {
  let list_of_info = [];
  // let game_info = []; 
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
    
    list_of_info.push({
      date: fixtures.data.data[i].time.starting_at.date,
      time: fixtures.data.data[i].time.starting_at.time,
      league_name: fixtures.data.data[i].league.data.name,
      home_team_name: home_team.data.data.name,
      away_team_name: away_team.data.data.name,
      home_score: fixtures.data.data[i].scores.localteam_score,
      away_score: fixtures.data.data[i].scores.visitorteam_score,
      filed: fixtures.data.data[i].venue.data.name,
    });
    if(isFuture){
      list_of_info.push({
      winner: fixtures.data.data[i].winner_team_id,
      //sechulde
      });
    } 
  };
  return list_of_info;
};
  
    // for(let i=0; i<fixtures.data.data.length; i++){
    //   list_of_info.push({ //add new game data
    //     date: fixtures.data.data[i].time.starting_at.date,
    //     time: fixtures.data.data[i].time.starting_at.time,
    //     league_name: fixtures.data.data[i].league.data.name,
    //     home_team_name: home_team.data.data.name,
    //     away_team_name: away_team.data.data.name,
    //     home_score: fixtures.data.data[i].scores.localteam_score,
    //     away_score: fixtures.data.data[i].scores.visitorteam_score,
    //     filed: fixtures.data.data[i].venue.data.name,
    //   });

    // }
  //   return list_of_info; 
  // }

  // };



exports.getLeagueDetails = getLeagueDetails;
exports.getPastGameDetails = getPastGameDetails;
exports.getFutureGameDetails = getFutureGameDetails;
