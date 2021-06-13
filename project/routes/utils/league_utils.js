const axios = require("axios");
const { DateTime } = require("mssql");
const { resolve } = require("path");
const DButils = require("../utils/DButils");

const LEAGUE_ID = 271;
const today = new Date();
const STARTDATE = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const ENDATEFUTURE = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 5);
const ENDATEPAST = today.getFullYear() + '-' + (today.getMonth()) + '-' + (today.getDate() + 10);

async function getLeagueDetails() {
    const league = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`, {
            params: {
                include: "season",
                api_token: process.env.api_token,
            },
        }
    );
    console.log(league);
    const stage = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/stages/season/${league.data.data.current_season_id}`, {
            params: {
                api_token: process.env.api_token,
            },
        }
    );

    let next_games = await getFutureGameDetails();

    return {
        league_name: league.data.data.name,
        current_season_name: league.data.data.season.data.name,
        current_stage_name: stage.data.data[1].name,
        home_team: next_games[0].home_team_name,
        away_team: next_games[0].away_team_name,
        date: next_games[0].date,
        field: next_games[0].field,
        nextGame: next_games[0].id
    };
}

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
    return extractRelevantGameData(fixtures, true);
}

async function getPastGameDetails() {
    var query = `select * from dbo.games where date<convert(date,'${today.toISOString().slice(0, 19).replace('T', ' ')}',120)`
    games_info = await DButils.execQuery(
        query
    );
    game_ids = [];
    games_info.map((game_info) => {
        game_ids.push(game_info.id + '001');
        game_ids.push(game_info.id + '002');
        game_ids.push(game_info.id + '003');
        game_info["events_id"] = [game_info.id + '001', game_info.id + '002', game_info.id + '003']
    })
    var query0 = `select * from dbo.events_schedule where events_scheduleID in (${game_ids})`
    events_info = await DButils.execQuery(
        query0
    );

    return { games_info, events_info };
}
async function getFutureGameDetails() {
    var query = `select * from dbo.games where date>='${today.toISOString().slice(0, 19).replace('T', ' ')}'  order by date ASC`
    games_info = await DButils.execQuery(
        query
    );
    return games_info;
}

async function getPastGameDetailsByTeam(team_name) {
    var query = `select * from dbo.games where date<convert(date,'${today.toISOString().slice(0, 19).replace('T', ' ')}',120) and (home_team_name='${team_name}' or away_team_name='${team_name}')`
    games_info = await DButils.execQuery(
        query
    );
    return games_info;
}
async function getFutureGameDetailsByTeam(team_name) {
    var query = `select * from dbo.games where date>='${today.toISOString().slice(0, 19).replace('T', ' ')}' and (home_team_name='${team_name}' or away_team_name='${team_name}') order by date ASC`
    games_info = await DButils.execQuery(
        query
    );
    return games_info;
}


async function insertNewGame(_date, _time, _league_name, _home_team_name, _away_team_name, _field, _free_referee_id) {
    let query = `select max(id) from dbo.games`
    let max_id = await DButils.execQuery(
        query
    );
    let str_max_id = String(parseInt(max_id[0]['']) + 1);
    let game_info = {
        id: str_max_id,
        date: `'${_date + ' ' + _time}'`,
        league_name: `'${_league_name}'`,
        home_team_name: `'${_home_team_name}'`,
        away_team_name: `'${_away_team_name}'`,
        home_score: -1,
        away_score: -1,
        field: `'${_field}'`,
        winner: `'none'`
    };
    query = `INSERT INTO dbo.games (${Object.keys(game_info)}) VALUES (${Object.values(game_info)})`
    await DButils.execQuery(
        query
    );
    await setRefereeToGameInDB(str_max_id, _free_referee_id);

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

        const home_team = await teamNameById(fixtures.data.data[i].localteam_id);
        const away_team = await teamNameById(fixtures.data.data[i].visitorteam_id);


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
            if (fixtures.data.data[i].winner_team_id == null) {
                game_info["winner"] = `'Draw'`;
            } else {
                const winner = await teamNameById(fixtures.data.data[i].winner_team_id);
                game_info["winner"] = `'${winner.data.data.name}'`;
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

async function teamNameById(team_id) {
    return await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/teams/${team_id}`, {
            params: {
                include: "Teams",
                api_token: process.env.api_token,
            },
        }
    );
}
async function createNewLeague(name) {
    await DButils.execQuery(
        `CREATE TABLE [dbo].[games_'${name}'](
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

async function setRefereeToGameInDB(last_game, free_referee_id) {
    DButils.execQuery(`INSERT INTO dbo.refree_games (referee_id, game_id) VALUES (${free_referee_id},${last_game})`);
}

async function getAllreferees() {
    return await DButils.execQuery(`SELECT * FROM dbo.refree`);
}

async function addReferee(refereeFisrtName, refereeLastName, qualification) {
    let query = `SELECT user_id FROM dbo.users WHERE first_name like '${refereeFisrtName}' AND last_name like '${refereeLastName}'`;
    const referee_id = await DButils.execQuery(
        query
    );
    if (referee_id.length == 0) {
        throw new TypeError("No such user")
    }
    const res = await insertNewRefereeToDB(referee_id[0].user_id, qualification);
    return res;
}

async function insertNewRefereeToDB(referee_id, referee_qualification) {
    let query = `INSERT INTO dbo.refree (user_id, qualification) VALUES (${referee_id}, '${referee_qualification}')`;
    let result = await DButils.execQuery(
        query);
    return result;
}

exports.addReferee = addReferee;
exports.createNewLeague = createNewLeague;
exports.getAllreferees = getAllreferees;
exports.getLeagueDetails = getLeagueDetails;
exports.getPastGameDetails = getPastGameDetails;
exports.getPastGameDetailsFromAPI = getPastGameDetailsFromAPI;
exports.getFutureGameDetailsFromAPI = getFutureGameDetailsFromAPI;
exports.getFutureGameDetails = getFutureGameDetails;
exports.insertNewGame = insertNewGame;
exports.getGameDetailsById = getGameDetailsById;
exports.getFutureGameDetailsByTeam = getFutureGameDetailsByTeam;
exports.getPastGameDetailsByTeam = getPastGameDetailsByTeam;