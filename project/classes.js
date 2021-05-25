class User {
    set_username(username) {
        this.username = username;
    }
}

class Member_User extends User {

    set_permissions(permission) {
        if (permission == "Fan") {
            this.permission = new Fan();
        } else if (permission == "Representative") {
            this.permission = new Union_Reps_Auth();
        }
    }

}

class Member_User_Role_Holder extends Member_User {
    constructor(username, permission, role) {
        super(username, permission);
        if (role == "referee") {
            this.role = new Referee();
        }
    }
}

class Guest extends User {
    constructor() {
        super();

    }
}

class Authorization {

}

class Union_Reps_Auth extends Authorization {
    constructor() {
        super();
    }
}
class Fan extends Authorization {
    constructor() {
        super();

    }
}
class Role {

}

class Referee extends Role {
    constructor() {
        super();

    }
}

exports.User = User;
exports.Member_User = Member_User;
exports.Member_User_Role_Holder = Member_User_Role_Holder;
exports.Union_Reps_Auth = Union_Reps_Auth;