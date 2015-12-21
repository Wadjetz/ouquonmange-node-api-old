const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users-model");

const localSignUpInit = function (req, email, password, callback) {
    User.findOne({ email: email }).then(user => {
        if (user) {
            return callback(null, false);
        }
        new User({
            email: email,
            password: User.hashPassword(password)
        }).save().then(result => {
            return callback(null, result);
        }).catch(error => {
            return callback(error);
        });
    }).catch(error => {
        return callback(error);
    });
};

const localLoginInit = function (req, email, password, callback) {
    User.findOne({
        email: email
    }).then(user => {
        if (!user || !user.validatePassword(password)) {
            return callback(null, false);
        }

        return callback(null, user);
    }).catch(error => {
        return callback(error);
    });
};

const localOptions = {
    usernameField: "email",
    passReqToCallack: true
};

passport.use(new LocalStrategy("local-signup", localOptions), localSignUpInit);
passport.use(new LocalStrategy("local-login", localOptions), localLoginInit);

module.exports = {
    localSignup: passport.authenticate("local-signup", {
        successRedirect: "/",
        failureRedirect: "/auth/local/signup"
    }),
    localLogin: passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/auth/local/login"
    })
};
