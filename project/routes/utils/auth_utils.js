const auth = require("../auth");
const classes = require("../../classes")
const bcrypt = require("bcryptjs");
let user_login;

// getPermission(){
//     let permission = '';
//     permission = updateRepresentativeLogin();
//     permission = getReffere();
//     permission = getplayer();

//     return permission;
// };

function createMemeberUser (user){
    user_login = new classes.Member_User(user.username, user.permissions);    
}

const get_curr_user_login_permoission = ()=>{
    return user_login.permission;  
}

const canHaveRepresentativePermission = (user)=>{
    if (user.permission == "Representative"){
        return new true();
    }
    return false;
};

exports.createMemeberUser = createMemeberUser;   
exports.canHaveRepresentativePermission = canHaveRepresentativePermission;
exports.get_curr_user_login_permoission = get_curr_user_login_permoission;