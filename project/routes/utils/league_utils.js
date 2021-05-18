const axios = require("axios");
const LEAGUE_ID = 271;

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
  const livescores = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/livescores/`,
    {
      params: {
        include: "Teams",
        api_token: process.env.api_token,
      },
    }
  );

  const home_team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/${livescores.data.data[0].localteam_id}/`,
    {
      params: {
        include: "Teams",
        api_token: process.env.api_token,
      },
    }
  );

  const away_team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/${livescores.data.data[0].visitorteam_id}`,
    {
      params: {
        include: "Teams",
        api_token: process.env.api_token,
      },
    }
  );

  const filed = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/venues/${livescores.data.data[0].venue_id}`,
    {
      params: {
        include: "Teams",
        api_token: process.env.api_token,
      },
    }
  );

  return {
    // league_data: livescores.data.data[0].time.starting_at.date,
    date: livescores.data.data[0].time.starting_at.date,
    time: livescores.data.data[0].time.starting_at.time,
    league_data: livescores.data.data[0].league_id,
    home_team_name: home_team.data.data.name,
    away_team_name: away_team.data.data.name,
    winner: livescores.data.data[0].winner_team_id,
    home_score: livescores.data.data[0].scores.localteam_score,
    away_score: livescores.data.data[0].scores.visitorteam_score,
    filed: filed.data.data.name,
    // next game details should come from DB
  };
}

async function getFutureGameDetails(){
  const livescores = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/livescores/`,
    {
      params: {
        include: "Teams",
        api_token: process.env.api_token,
      },
    }
  );

  const home_team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/${livescores.data.data[0].localteam_id}/`,
    {
      params: {
        include: "Teams",
        api_token: process.env.api_token,
      },
    }
  );

  const away_team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/${livescores.data.data[0].visitorteam_id}`,
    {
      params: {
        include: "Teams",
        api_token: process.env.api_token,
      },
    }
  );

  const filed = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/venues/${livescores.data.data[0].venue_id}`,
    {
      params: {
        include: "Teams",
        api_token: process.env.api_token,
      },
    }
  );

  return {
    // league_data: livescores.data.data[0].time.starting_at.date,
    date: livescores.data.data[0].time.starting_at.date,
    time: livescores.data.data[0].time.starting_at.time,
    league_data: livescores.data.data[0].league_id,
    home_team_name: home_team.data.data.name,
    away_team_name: away_team.data.data.name,
    filed: filed.data.data.name,

    // winner: livescores.data.data[0].winner_team_id,
    // home_score: livescores.data.data[0].scores.localteam_score,
    // away_score: livescores.data.data[0].scores.visitorteam_score,
    // next game details should come from DB
  };
}

exports.getLeagueDetails = getLeagueDetails;
exports.getPastGameDetails = getPastGameDetails;
exports.getFutureGameDetails = getFutureGameDetails;
