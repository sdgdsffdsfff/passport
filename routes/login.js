var express = require('express');
var router = express.Router();
var User = require('../db/user.js');
var Code = require('../db/code.js');

// Define user login routes
router.get('/', function (req, res) {
    var backUrl = req.query.backUrl || '';
    res.render('login', {
        backUrl: backUrl
    });
});

router.post('/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var backUrl = req.body.backUrl;
    User.checkUser(username, password, function (err, userEntity) {
        if (err || !userEntity) {
            res.status('500');
            res.send({
                success: false,
                model: {
                    error: '系统错误'
                }
            });
        }

        if (userEntity) {
            Code.createCode(userEntity, function (err, codeEntity) {
                if (err || !userEntity) {
                    res.status('500');
                    res.send({
                        success: false,
                        model: {
                            error: '系统错误'
                        }
                    });
                }

                if (codeEntity) {
                    res.redirect(backUrl + '?code=' + codeEntity.tempCode);
                }

            });
        }

    });
});


module.exports = router;