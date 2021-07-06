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
    var query1 = `select game_id from dbo.favoriteGames where game_id = ${game_ids[0].id}`;
    const game_ids1 = await DButils.execQuery(
        query1
    );
    console.log(game_ids1)
    if (game_ids1.length > 0) {
        return "The game is already in favorite list"
    }
    var query = `insert into dbo.favoriteGames (user_id,game_id) values (${user_id},${game_ids[0]["id"]})`;
    await DButils.execQuery(
        query
    );
    return "The game successfully saved as favorite";

}


async function getFavoriteGames(user_id) {
    var query = `select game_id from dbo.favoriteGames where user_id = ${user_id}`;
    const game_ids = await DButils.execQuery(
        query
    );
    return game_ids;
}



exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;