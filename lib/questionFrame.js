var lexicalInfo = require('./lexicalInfo');
var textLib = require('./textLib');

var tenses = {
  'present': {}
};

function getConceptMetadata(subject, relationMetadata, callback) {

    lexicalInfo.findNounPlurals(subject, function(err, nounInfo) {

        var result;

        if (subject === 'person') {
            result = {
                'querySubjectForm': 'Who',
                'pluralForm': nounInfo.plural
            };
        } else {
            if (relationMetadata.isVerb) {

                if (relationMetadata.isHasVerbPhrase) {
                    result = {
                        'querySubjectForm': 'Which ' + subject,
                        'queryObjectForm': 'What',
                        'queryPluralSubjectForm': 'which ' + nounInfo.plural,
                        'pluralForm': nounInfo.plural
                    };

                }
                else if  (relationMetadata.phraseTail) {
                    result = {
                        'query': {'singularObject': 'what', 'pluralObject':'which'},
                        'querySubjectForm': 'Which ' + subject,
                        'queryObjectForm': 'Which',
                        'queryPluralSubjectForm': 'which ' + nounInfo.plural,
                        'pluralForm': nounInfo.plural
                    };

                }  else {
                    result = {
                        'querySubjectForm': 'Which ' + subject,
                        'queryObjectForm': 'Which',
                        'queryPluralSubjectForm': 'which ' + nounInfo.plural,
                        'pluralForm': nounInfo.plural
                    };

                }
            } else {
                result = {
                    'querySubjectForm': 'which ' + subject,
                    'queryObjectForm': 'what',
                    'queryPluralSubjectForm': '3which ' + nounInfo.plural,
                    'pluralForm': nounInfo.plural
                };
            }
        }

        callback(null, result);
    });
}

function capFirst(text) {
    return textLib.capitalizeFirstLetter(text);
}

function process(triple, callback) {

    var cleanSubject = triple.subject.toLowerCase();
    var cleanRelationship = triple.relationship.toLowerCase();
    var cleanObject = triple.object.toLowerCase();

    var tenseHint = null;

    lexicalInfo.lookup(cleanRelationship, function(err, relationMetadata) {
        if(err) {
            return callback(err, null);
        }

        getConceptMetadata(cleanSubject, relationMetadata, function(err, subjectMetadata) {

            getConceptMetadata(cleanObject, relationMetadata, function(err, objectMetadata) {
                if (relationMetadata.isVerb) {

                    if (relationMetadata.isHasVerbPhrase) {
                        var result = {
                            'query-fact': capFirst( relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-subject-plural': capFirst( subjectMetadata.querySubjectForm + '\'s ' + relationMetadata.phraseTail.singular + ' ' + relationMetadata.getIsWas() + ' {O}?'),
                            'query-object-singular': capFirst( objectMetadata.queryObjectForm + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.phraseTail.singular + ' of {S}?'),
                            'query-object-plural': capFirst( objectMetadata.queryObjectForm + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.phraseTail.plural + ' of {S}?')
                        };
                    } else if (relationMetadata.phraseTail) {
                        var result = {
                            'query-fact': capFirst( relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-subject-plural': capFirst( subjectMetadata.queryPluralSubjectForm + ' ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-object-singular': capFirst( objectMetadata.query.singularObject + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.query.singularObject + ' of {S}?'),
                            'query-object-plural': capFirst( objectMetadata.query.pluralObject + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.query.pluralObject + ' of {S}?')
                        };
                    }
                    else {

                        var result = {
                            'query-fact': capFirst( relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-subject-plural': capFirst( subjectMetadata.querySubjectForm + ' ' + relationMetadata.getSubjectQuery() + ' {O}?'),
                            'query-object-singular': capFirst(objectMetadata.queryObjectForm + ' ' + cleanObject + ' ' + relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getObjectQuery() + '?'),
                            'query-object-plural': capFirst(objectMetadata.queryObjectForm + ' ' + objectMetadata.pluralForm + ' ' + relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getPluralObjectQuery() + '?')
                        };
                    }
                } else {
                    var result = {
                        'query-fact': capFirst( relationMetadata.getIsWas() + ' the ' + relationMetadata.getFactQuery() + ' of {S} {O}?'),
                        'query-subject-plural': capFirst( subjectMetadata.querySubjectForm + '\'s ' + relationMetadata.getSubjectQuery() + ' ' + relationMetadata.getIsWas() + ' {O}?'),
                        'query-object-singular': capFirst( objectMetadata.queryObjectForm + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.getObjectQuery() + ' of {S}?'),
                        'query-object-plural': capFirst( objectMetadata.queryObjectForm + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.getPluralObjectQuery() + ' of {S}?')
                    };
                }

                callback(null, result);

            });
        });

    });
}

module.exports.process = process;
