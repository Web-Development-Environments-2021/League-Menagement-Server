const axios = require("axios");
const { DateTime } = require("mssql");
const DButils = require("../utils/DButils");

const LEAGUE_ID = 271;
const today = new Date();
const STARTDATE = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const ENDATEFUTURE = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 5);
const ENDATEPAST = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() - 5);

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


async function getPastGameDetailsFromAPI() {
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

async function getGameDetailsById(game_id_list) {
    var query = '';
    if (game_id_list.length == 0) {
        query = `select * from dbo.games where id in (-1);`;
    } else {
        query = `select * from dbo.games where id in (${game_id_list});`;
    }
    games_info = await DButils.execQuery(
        query
    );
    return games_info;
}

async function getFutureGameDetailsFromAPI() {
    const fixtures = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/fixtures/between/${STARTDATE}/${ENDATEFUTURE}`, {
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

async function getPastGameDetails() {
    var query = `select * from dbo.games where date<convert(date,'${today.toISOString().slice(0, 19).replace('T', ' ')}',120)`
    games_info = await DButils.execQuery(
        query
    );
    return games_info;
}
async function getFutureGameDetails() {
    var query = `select * from dbo.games where date>='${today.toISOString().slice(0, 19).replace('T', ' ')}'`
    games_info = await DButils.execQuery(
        query
    );
    return games_info;
}
async function insertNewGame(_date, _time, _league_name, _home_team_name, _away_team_name, _field, _free_referee) {
    // if (!(auth_utils.get_curr_user_login_permoission() instanceof classes.Union_Reps_Auth)) {
    //     console.log(false);
    //     return;
    // }
    var query = `select max(id) from dbo.games`
    let max_id = await DButils.execQuery(
        query
    );
    let game_info = {
        id: String(parseInt(max_id[0]['']) + 1),
        date: `'${_date + ' ' + _time}'`,
        league_name: `'${_league_name}'`,
        home_team_name: `'${_home_team_name}'`,
        away_team_name: `'${_away_team_name}'`,
        home_score: -1,
        away_score: -1,
        field: `'${_field}'`,
        winner: `'none'`
    };
    var query = `INSERT INTO dbo.games (${Object.keys(game_info)}) VALUES (${Object.values(game_info)})`
    await DButils.execQuery(
        query
    );
    await setRefereeToGameInDB(max_id + 1, _free_referee);
    // next game details should come from DB
    return game_info;
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
            date: `'${date +' '+ new_time}'`,
            // time: `'${new_time}'`,
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
            date: `'${fixtures.data.data[i].time.starting_at.date + ' ' + fixtures.data.data[i].time.starting_at.time}'`,
            // time: `'${fixtures.data.data[i].time.starting_at.time}'`,
            league_name: `'${fixtures.data.data[i].league.data.name}'`,
            home_team_name: `'${home_team.data.data.name}'`,
            away_team_name: `'${away_team.data.data.name}'`,
            home_score: fixtures.data.data[i].scores.localteam_score,
            away_score: fixtures.data.data[i].scores.visitorteam_score,
            field: `'${fixtures.data.data[i].venue.data.name}'`,

        };
        events = fixtures.data.data[i].events;
        if (isPastGame) {
            game_info["winner"] = fixtures.data.data[i].winner_team_id;
            if (game_info["winner"] == null) {
                game_info["winner"] = `'"Draw"'`;
            }
            await insert_events(events, fixtures.data.data[i].time.starting_at.date, fixtures.data.data[i].time.starting_at.time);
        } else {
            game_info["winner"] = `'"none"'`;
        }
        var query = `INSERT INTO dbo.games (${Object.keys(game_info)}) VALUES (${Object.values(game_info)})`
        await DButils.execQuery(
            query
        );
        list_of_info.push(game_info);
    };


    return list_of_info;
};

async function createNewLeague(name) {
    await DButils.execQuery(
        `CREATE TABLE [dbo].[games_'${name}}'](
            [id] [int]  NOT NULL PRIMARY KEY,
            [date] [varchar] (30) NOT NULL,
            [time] [varchar] (30) NOT NULL,
            [league_name] [varchar](300) NOT NULL,
            [home_team_name] [varchar](30) NOT NULL,
            [away_team_name] [varchar](30) NOT NULL,
            [referee] [varchar] (30),
            [home_score] [int] NOT NULL,
            [away_score] [int] NOT NULL,
            [filed] [varchar] (30) NOT NULL,
            [winner] [varchar] (30) NOT NULL,
        );`
    );

}

function setRefereeToGameInDB(last_game, free_referee){
    // let last_game = DButils.execQuery(`SELECT max(id) FROM dbo.games`);
    let all_referees = DButils.execQuery(`INSERT INTO dbo.refree_games (refree_id, game_id) VALUES (${free_referee},${last_game})`);    
}

async function getAllreferees(){
    return await DButils.execQuery(`SELECT max(id) FROM dbo.refree`);
}

exports.createNewLeague = createNewLeague;
exports.getAllreferees = getAllreferees;
exports.getLeagueDetails = getLeagueDetails;
exports.getPastGameDetails = getPastGameDetails;
exports.getPastGameDetailsFromAPI = getPastGameDetailsFromAPI;
exports.getFutureGameDetailsFromAPI = getFutureGameDetailsFromAPI;
exports.getFutureGameDetails = getFutureGameDetails;
exports.insertNewGame = insertNewGame;
exports.getGameDetailsById = getGameDetailsById;