"use strict";

//const DB = require("../database");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

const User = new Schema({
    email: String,
    password: String
});

User.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

User.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", User);

// const collection = DB.collection("users");

// module.exports.findByToken = function (token) {
//     return new Promise(function(resolve, reject) {
//         collection.findOne({
//             token: token
//         }, (error, user) => {
//             if (error) reject(error);
//             else if (user) resolve(user);
//             else reject({
//               code: 404,
//               message: "User Not found"
//             });
//         });
//     });
// };

// module.exports.insert = function (user) {
//     return new Promise(function(resolve, reject) {
//         collection.insert(user, (error, result) => {
//             if (error) reject(error);
//             else if (result.insertedCount > 0) resolve(result.ops[0]);
//             else reject({
//                 code: 500,
//                 message: "Zero document inserted"
//             });
//         });
//     });
// };
