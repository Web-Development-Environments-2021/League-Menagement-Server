class User {
    constructor(username) {
        this.username = username;
    }
}

class Member_User extends User {
    constructor(username, permission) {
        super(username);
        if (permission == "fan") {
            this.permission = new Fan();
        } else if (permission == "Representative") {
            this.permission = new Union_Reps_Auth();
        }
    }

}

class Member_User_Role_Holder extends Member_User {
    constructor(username, permission, role) {
        super(username, permission);

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