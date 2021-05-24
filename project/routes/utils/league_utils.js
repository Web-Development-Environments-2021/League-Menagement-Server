const axios = require("axios");
const { DateTime } = require("mssql");
const DButils = require("../utils/DButils");
const auth_utils = require("../utils/auth_utils");
const classes = require("../../classes");
const LEAGUE_ID = 271;
const today = new Date();
const STARTDATE = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const ENDATEFUTURE = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 3);
const ENDATEPAST = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() - 3);

async function getLeagueDetails() {
    const league = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`, {
            params: {
                include: "season",
                api_token: process.env.api_token,
            },
        }
    );
    const stage = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`, {
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


async function getPastGameDetails() {
    const fixtures = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/fixtures/between/${ENDATEPAST}/${STARTDATE}`, {
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
  if(!(auth_utils.get_curr_user_login_permoission() instanceof classes.Union_Reps_Auth)){
    console.log(false);
    return;
  }
  console.log(true);
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
async function insert_events(events, date, time) {
    for (let i = 0; i < 3; i++) {
        const { id, minute, extra_minute, type, player } = events.data[i];
        var d = new Date();
        let splitted_time = time.split(':');
        d.setHours(splitted_time[0]);
        d.setMinutes(splitted_time[1] + minute);
        d.setSeconds(splitted_time[2]);

        // splitted_time[1] = string(int(splitted_time[1]) + minute);
        var new_time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        event_info = {
            events_scheduleID: id,
            date: date,
            time: `'${new_time}'`,
            minute: minute,
            extra_minute: extra_minute,
            player_id: player.data.player_id,
            player_name: `'${player.data.fullname}'`,
            type: `'${type}'`,
        };
        if (events.data[i].extra_minute == null) {
            event_info.extra_minute = 0;
        }
        var query = `INSERT INTO dbo.events_schedule (${Object.keys(event_info)}) VALUES (${Object.values(event_info)})`
        await DButils.execQuery(
            query
        );


    }
}
const extractRelevantGameData = async(fixtures, isPastGame) => {
    let list_of_info = [];
    let game_info = {};
    console.log(fixtures.data.data.length);
    for (let i = 0; i < fixtures.data.data.length; i++) {

        const home_team = await axios.get(
            `https://soccer.sportmonks.com/api/v2.0/teams/${fixtures.data.data[i].localteam_id}/`, {
                params: {
                    include: "Teams",
                    api_token: process.env.api_token,
                },
            }
        );
        const away_team = await axios.get(
            `https://soccer.sportmonks.com/api/v2.0/teams/${fixtures.data.data[i].visitorteam_id}`, {
                params: {
                    include: "Teams",
                    api_token: process.env.api_token,
                },
            }
        );

        game_info = {
            id: fixtures.data.data[i].id,
            date: `'${fixtures.data.data[i].time.starting_at.date}'`,
            time: `'${fixtures.data.data[i].time.starting_at.time}'`,
            league_name: `'${fixtures.data.data[i].league.data.name}'`,
            home_team_name: `'${home_team.data.data.name}'`,
            away_team_name: `'${away_team.data.data.name}'`,
            home_score: fixtures.data.data[i].scores.localteam_score,
            away_score: fixtures.data.data[i].scores.visitorteam_score,
            filed: `'${fixtures.data.data[i].venue.data.name}'`,

        };
        events = fixtures.data.data[i].events;
        if (isPastGame) {
            game_info["winner"] = fixtures.data.data[i].winner_team_id;
            await insert_events(events, game_info.date, fixtures.data.data[i].time.starting_at.time);
        } else {
            game_info["winner"] = "none";
        }
        var query = `INSERT INTO dbo.games (${Object.keys(game_info)}) VALUES (${Object.values(game_info)})`
        await DButils.execQuery(
            query
        );
        list_of_info.push(game_info);
    };


    return list_of_info;
};

exports.getLeagueDetails = getLeagueDetails;
exports.getPastGameDetails = getPastGameDetails;
exports.getFutureGameDetails = getFutureGameDetails;