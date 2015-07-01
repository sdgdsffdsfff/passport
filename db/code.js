var mongoose = require('mongoose');

var CodeSchema = new mongoose.Schema({
    tempCode: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

CodeSchema.static('createCode', function (user, cb) {
    var tempCode = Math.random().toString(36).substr(2);
    return new CodeModel({
        tempCode: tempCode,
        user: user
    }).save(cb);
});

CodeSchema.static('getCode', function (tempCode, cb) {
    return this.findOne({
        tempCode: tempCode
    }).exec(cb);
});

CodeSchema.static('delCode', function (tempCode) {

    return this.findOneAndRemove({
        tempCode: tempCode
    }, function () {
    });
});


var CodeModel = mongoose.model('Code', CodeSchema);
module.exports = CodeModel;