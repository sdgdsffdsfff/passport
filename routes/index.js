var express = require('express');
var router = express.Router();
var User = require('../db/user.js');
var Code = require('../db/code.js');
var Token = require('../db/token.js');


router.get('/', function (req, res) {
    res.render('index');
});


router.get('/user', function (req, res) {
    var token = req.query.token;
    Token.getToken(token, function (err, tokenEntity) {
        if (err || !tokenEntity) {
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
                    user: mixObject(tokenEntity.user)
                }
            });
        }
    });
});

function mixObject(obj) {
    var tmpObj = {};
    for (var key in obj) {
        if (type(obj[key]) == 'string' || type(obj[key]) == 'number' || type(obj[key]) == 'array') {
            tmpObj[key] = obj[key];
        }
    }
    delete tmpObj.password;
    return tmpObj;
}

function type(o) {
    var TYPES = {
        'undefined': 'undefined',
        'number': 'number',
        'boolean': 'boolean',
        'string': 'string',
        '[object String]': 'string',
        '[object Number]': 'number',
        '[object Function]': 'function',
        '[object RegExp]': 'regexp',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Error]': 'error'
    };

    var TOSTRING = Object.prototype.toString;
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
}

module.exports = router;