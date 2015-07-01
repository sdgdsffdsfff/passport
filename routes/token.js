var express = require('express');
var router = express.Router();
var User = require('../db/user.js');
var Code = require('../db/code.js');
var Token = require('../db/token.js');


router.post('/', function (req, res) {
    var tempCode = req.body.code;
    if (tempCode) {
        Code.getCode(tempCode, function (err, codeEntity) {
            if (err || !codeEntity) {
                res.status('500');
                res.send({
                    success: false,
                    model: {
                        error: '系统错误'
                    }
                });
            }

            if (codeEntity) {

                Code.delCode(tempCode);

                Token.createToken(codeEntity.user, function (err, tokenEntity) {
                    if (err || !codeEntity) {
                        res.status('500');
                        res.send({
                            success: false,
                            model: {
                                error: '系统错误'
                            }
                        });
                    }

                    if (tokenEntity) {
                        res.status('200');
                        res.send({
                            success: true,
                            model: {
                                token: tokenEntity.tempToken
                            }
                        });
                    }

                });
            }

        });

    }
});


module.exports = router;