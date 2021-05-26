const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;

async function getCoachName(team_id) {
    const coach_data = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "coach",
        api_token: process.env.api_token,
      },
    });
    console.log(coach_data.data.data.coach.data.common_name);
    return {coach_name: coach_data.data.data.coach.data.common_name};
}

function extractTeamName(team_info) {

  return team_info.data.data.map((team_info) => {
      const team_name  = team_info.name;
      const team_id  = team_info.id;
      return {
          team_name: team_name,
          team_id: team_id
      };
  });
}

async function getAllTeamsByCountry(COUNTRY_ID){
  let promises = [];
  let teams_info = await axios.get(`https://soccer.sportmonks.com/api/v2.0/countries/${COUNTRY_ID}/teams`, {
      params: {
          api_token: process.env.api_token,
      },
  });
  var all_teams_name = extractTeamName(teams_info);
  return all_teams_name;

}

async function searchTeamsInfoByName(TEAM_NAME){
  const teams_info = await axios.get(
    `${api_domain}/teams/search/${TEAM_NAME}`,{
      params:{
        include : "league",
        api_token : process.env.api_token,
      }
    }
  );
  if(teams_info.data.data[0].league.data.id ==LEAGUE_ID){
      error("team not found"); 
  }
  const {name, logo_path} = teams_info.data.data[0];
  return {
      team_name: name,
      logo_path: logo_path,
  };
}


exports.searchTeamsInfoByName = searchTeamsInfoByName;
exports.getAllTeamsByCountry = getAllTeamsByCountry;
exports.getCoachName = getCoachName;