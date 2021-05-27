var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const auth_utils = require("../routes/utils/auth_utils");
const classes = require("../classes")
const bcrypt = require("bcryptjs");
let user_login;

router.post("/Register", async(req, res, next) => {
    try {
        await auth_utils.register(req);
        res.status(201).send("user created");
    } catch (error) {
        next(error);
    }
});

router.post("/Login", async(req, res, next) => {
    try {
        await auth_utils.Login(req, res);
        // return cookie
        res.status(200).send("login succeeded");
    } catch (error) {
        next(error);
    }
});

router.post("/Logout", function(req, res) {
    req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
    res.send({ success: true, message: "logout succeeded" });
});




module.exports = router;