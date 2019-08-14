var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');
 
// routes
router.post('/tokenise', tokenise);
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
 
module.exports = router;

function tokenise(req, res) {
	console.log("Tokenising Browser : " + req.body.uniqueBrowser);
    userService.tokenise(req.body.uniqueBrowser)
        .then(function (signedToken) {
            if (signedToken) {
                res.send(signedToken);
            } else {
                res.status(400).send('Token Signing Failed');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function authenticate(req, res) {
	console.log("Authenticating User : " + req.body.username);
    userService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function register(req, res) {
    userService.create(req.body)
        .then(function () {
			console.log("REGISTER SUCCESS ! Returning 200");
            res.sendStatus(200);
        })
        .catch(function (err) {
			console.log("Returning 400 >>>> " + err);
            res.status(400).send(err);
        });
}
 
function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}