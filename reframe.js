var questionFrame = require('./lib/questionFrame');

function reframe(subject, relationship, object, callback) {

    var result = {};

    questionFrame.process({'subject':subject, 'relationship':relationship, 'object':object}, function(err, queryResult) {
        if (err) {
            callback(err, null);
        } else {
            result.query = queryResult;
            callback(null, result);
        }
    });

}

module.exports.reframe = reframe;
