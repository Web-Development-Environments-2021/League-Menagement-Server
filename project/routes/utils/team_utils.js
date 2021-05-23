const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

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

exports.getCoachName = getCoachName;