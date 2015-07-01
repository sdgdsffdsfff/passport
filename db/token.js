var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
    tempToken: {
        type: String
    },
    expires: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

TokenSchema.static('createToken', function (user, cb) {
    var tempToken = Math.random().toString(36).substr(2);
    //TODO token30天过期
    var expires = new Date().getTime() + 1000 * 60 * 60 * 24 * 30;
    return new TokenModel({
        tempToken: tempToken,
        user: user,
        expires: expires
    }).save(cb);
});

TokenSchema.static('getToken', function (tempToken, cb) {
    return this.findOne({
        tempToken: tempToken
    }).populate({path: 'user'}).exec(cb);
});

TokenSchema.static('delExpiredToken', function (expiredDate) {
    var me = this;
    return me.find({}).exec(function (err, tokens) {
        if (err) {
            return;
        }

        if (tokens) {
            tokens.forEach(function (oneToken) {
                if (oneToken.expires < expiredDate) {
                    me.findOneAndRemove({
                        tempToken: oneToken.tempToken
                    }, function () {
                    });
                }
            });

        }

    });
});

var TokenModel = mongoose.model('Token', TokenSchema);
module.exports = TokenModel;