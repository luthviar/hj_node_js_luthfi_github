var env = process.env.NODE_ENV || 'development';
var config = require('../../config.json')[env];
var http = require("http");
var express = require("express");
var qs = require("querystring");

var models = require("../models");
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var dateFormat = require('dateformat');

var Q = require('q');
/*var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');*/
 
var service = {};
 
service.tokenise = tokenise;
service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
 
module.exports = service;

function tokenise (uniqueBrowser) {
    var deferred = Q.defer();
    deferred.resolve({token: jwt.sign({ sub: uniqueBrowser }, config.secret)});
    console.log("Resolved tokenise function : " + uniqueBrowser);
    return deferred.promise;
}

function authenticate(username, password) {
    var deferred = Q.defer();
    
    models.Users.findOne({
		where: { username: username }
	})
	.then (function (user, err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
 
        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
			console.log("AUTHENTICATED SUCCESS >>  " + user);
			console.log("Secret >>  " + config.secret);
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
			console.log("AUTHENTICATED FAILED >>  " + user);
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}
 
function getAll() {
    var deferred = Q.defer();
	console.log("getAll");
    models.Users.findAll({limit:10})
		.then(function (users, err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        console.log("RETURNED USERS : " + users[0].username);
        
        // return users (without hashed passwords)
        // this function is eating up the entire user instead of just the field
        /*users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });*/
        
        deferred.resolve(users);
    });
 
    return deferred.promise;
}
 
function getById(_id) {
    var deferred = Q.defer();
 
    models.Users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
 
        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}
 
function create(userParam) {
    var deferred = Q.defer();

    // validation
	console.log("LOOKING UP USER : " + userParam.username);
    models.Users.findOne({
		where: { username: userParam.username }
	})
	.then(function (user, err) {
		if (err) deferred.reject(err.name + ': ' + err.message);
		if (user) {
			console.log("INFO >>" + 'Username "' + userParam.username + '" is already taken');
			
			// username already exists
			deferred.reject('Username already taken "' + user.username + '"');
		} else {
			console.log("INFO >>" + 'Creating Username "' + userParam.username + '" !');
			createUser();
		}
	});
 
    function createUser() {
		var user = userParam;
        // set user object to userParam without the cleartext password
        //var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
		console.log(user);
        models.Users.create(user)
		.then(newUser => {
			deferred.resolve(newUser);
		})
		.catch(err => {
			console.log("ERRR >>>>" + err.name + ': ' + err.message);
			if (err) deferred.reject(err.name + ': ' + err.message);
		});
    }

    return deferred.promise;
}
 
function update(_id, userParam) {
    var deferred = Q.defer();
 
    // validation
    models.Users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
 
        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            models.Users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
 
                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });
 
    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };
 
        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }
 
        models.Users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
 
                deferred.resolve();
            });
    }
 
    return deferred.promise;
}
 
function _delete(_id) {
    var deferred = Q.defer();
 
    models.Users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}