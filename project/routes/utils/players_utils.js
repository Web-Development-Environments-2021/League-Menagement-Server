const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
    let player_ids_list = [];
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            include: "squad",
            api_token: process.env.api_token,
        },
    });
    team.data.data.squad.data.map((player) =>
        player_ids_list.push(player.player_id)
    );
    return player_ids_list;
}

async function getPlayersInfo(players_ids_list, isFull) {
    let promises = [];
    players_ids_list.map((id) =>
        promises.push(
            axios.get(`${api_domain}/players/${id}`, {
                params: {
                    api_token: process.env.api_token,
                    include: "team",
                },
            })
        )
    );
    let players_info = await Promise.all(promises);
    var preview_info = await extractRelevantPlayerOrCoachData(players_info);
    if (isFull) {
        var fullInfo = extractFullPlayerData(players_info);
        for (i = 0; i < preview_info.length; i++) {
            preview_info[i] = Object.assign({}, preview_info[i], fullInfo[i])
        }
    }

    return preview_info;
}
async function getCoachesInfo(coaches_ids_list, isFull) {
    let promises = [];
    coaches_ids_list.map((id) =>
        promises.push(
            axios.get(`${api_domain}/coaches/${id}`, {
                params: {
                    api_token: process.env.api_token,
                },
            })
        )
    );
    let coaches_info = await Promise.all(promises);
    var preview_info = extractRelevantPlayerOrCoachData(coaches_info, true);
    var fullInfo = extractFullCoachData(coaches_info);
    for (i = 0; i < preview_info.length; i++) {
        const { team_id } = coaches_info[i].data.data;
        preview_info[i].team_name = await getTeamById(team_id);
        if (isFull) {
            preview_info[i] = Object.assign({}, preview_info[i], fullInfo[i])
        }
    }


    return preview_info;
}

function extractFullPlayerData(players_info) {
    return players_info.map((player_info) => {
        const { common_name, nationality, birthcountry, birthdate, height, weight } = player_info.data.data;
        return {
            common_name,
            nationality,
            birthcountry,
            birthdate,
            height,
            weight,
        };
    });
}

function extractFullCoachData(coaches_info) {
    return coaches_info.map((coach_info) => {
        const { common_name, nationality, birthcountry, birthdate } = coach_info.data.data;
        return {
            common_name,
            nationality,
            birthcountry,
            birthdate,
        };
    });
}

function extractRelevantPlayerOrCoachData(players_info, isCoach = false) {

    return players_info.map((player_info) => {
        const { fullname, image_path, position_id } = player_info.data.data;
        var name = '';
        if (!isCoach) {
            name = player_info.data.data.team.data.name;
        }
        return {
            name: fullname,
            image: image_path,
            position: position_id,
            team_name: name,
        };
    });
}

async function getPlayersByTeam(team_id) {
    let player_ids_list = await getPlayerIdsByTeam(team_id);
    let players_info = await getPlayersInfo(player_ids_list);
    return players_info;
}
async function getTeamById(team_id) {
    let team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            api_token: process.env.api_token,
        },
    });
    return team.data.data.name;
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getCoachesInfo = getCoachesInfo;