const auth = require("../auth");
const classes = require("../../classes");
const reps = require("../utils/permission_representative");
const bcrypt = require("bcryptjs");
const user_login = new classes.Member_User;
const DButils = require("../utils/DButils");



// function createMemeberUser (user){
//     // if((user.permissions == "Representative") && (reps.RepresentativePermission() == "undefined")){

//     // }
//     user_login = new classes.Member_User(user.username, user.permissions);    
// }

const get_curr_user_login_permoission = () => {
    if ((user_login.permission instanceof classes.Union_Reps_Auth)) {
        return true;
    }
    else if(user_login.permission == null) {
        return null;
    }
    else if(user.login.permission instanceof classes.Fan){
        return false;
    }
};
async function register(req) {
    const users = await DButils.execQuery(
        "SELECT username FROM dbo.users;"
    );

    if (users.find((x) => x.username === req.body.username))
        throw { status: 409, message: "Username has been taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    var query0 = `select max(user_id) from dbo.users`
    max_id = await DButils.execQuery(
        query0
    );
    var id = 0;
    if (max_id[0][''] != null) {
        var id = String(parseInt(max_id[0]['']) + 1);
    }
    // add the new username
    await DButils.execQuery(
        `INSERT INTO dbo.users (user_id, username, password, permissions, first_name, last_name, country, email, image_user) 
        VALUES (${id}, '${req.body.username}','${hash_password}', 'Fan', '${req.body.firstname}','${req.body.lastname}',
        '${req.body.country}', '${req.body.email}','${req.body.image_url}')`
    );
}
async function Login(req, res) {
    const user = (
        await DButils.execQuery(
            `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
        )
    )[0];
    // user = user[0];
    console.log(user);
    console.log(user.permissions);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    createMemeberUser(user);
}

function createMemeberUser(user) {
    // user_login = new classes.Member_User(user.username, user.permissions);
    user_login.set_username(user.username);
    user_login.set_permissions(user.permissions);
}

// const get_user_login_permoission = () => {
//     return user_login.permission;
// }


exports.createMemeberUser = createMemeberUser;
exports.get_curr_user_login_permoission = get_curr_user_login_permoission;
exports.register = register;
exports.Login = Login;