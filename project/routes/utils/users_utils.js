const DButils = require("./DButils");
const player_utils = require("./players_utils");
const team_utils = require("./team_utils");

async function markGameAsFavorite(user_id, game_id) {
    var query0 = `select id from dbo.games where id = ${game_id}`;
    const game_ids = await DButils.execQuery(
        query0
    );
    if (game_ids.length == 0) {
        throw new TypeError("no game with this game_id");
    }
    var query = `insert into dbo.favoriteGames (user_id,game_id) values (${user_id},${game_ids[0]["id"]})`;
    await DButils.execQuery(
        query
    );
    return "The game successfully saved as favorite";

}

// async function markPlayerAsFavorite(player_id){

// }

// async function markTeamAsFavorite(user_id, team_name){
//     let team_object = team_utils.searchTeamsInfoByName(team_name);
//     let team_id = team_object["team_id"];
//     let query = `INSERT INTO dbo.favoriteTeam (user_id, team_id) VALUES (${user_id}, ${team_id})`
// }

async function getFavoriteGames(user_id) {
    var query = `select game_id from dbo.favoriteGames where user_id = ${user_id}`;
    const game_ids = await DButils.execQuery(
        query
    );
    return game_ids;
}

// async function getFavoritePlayersInfo(player_id){
// }

// async function getFavoriteTeamsInfo(player_id){

// }

exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;