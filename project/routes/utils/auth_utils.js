const auth = require("../auth");
const classes = require("../../classes");
const reps = require("../utils/permission_representative");
const bcrypt = require("bcryptjs");
let user_login;



function createMemeberUser (user){
    // if((user.permissions == "Representative") && (reps.RepresentativePermission() == "undefined")){
        
    // }
    user_login = new classes.Member_User(user.username, user.permissions);    
}

const get_curr_user_login_permoission = ()=>{
    if((user_login.permission instanceof classes.Union_Reps_Auth)){
        return true;
      }
      else{
        return false; 
      }
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