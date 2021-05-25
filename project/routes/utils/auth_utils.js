const auth = require("../auth");
const classes = require("../../classes")
const bcrypt = require("bcryptjs");
const user_login = new classes.Member_User;
const DButils = require("../utils/DButils");

// getPermission(){
//     let permission = '';
//     permission = updateRepresentativeLogin();
//     permission = getReffere();
//     permission = getplayer();

//     return permission;
// };
async function register(req, res, next) {
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

    // add the new username
    await DButils.execQuery(
        `INSERT INTO dbo.users (username, password, permissions) VALUES ('${req.body.username}', '${hash_password}', 'Fan')`
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

const get_curr_user_login_permoission = () => {
    return user_login.permission;
}

const canHaveRepresentativePermission = (user) => {
    if (user.permission == "Representative") {
        return new true();
    }
    return false;
};

exports.createMemeberUser = createMemeberUser;
exports.canHaveRepresentativePermission = canHaveRepresentativePermission;
exports.get_curr_user_login_permoission = get_curr_user_login_permoission;
exports.register = register;
exports.Login = Login;