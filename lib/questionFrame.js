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
                'style': 'human',
                'query': {'pluralSubject': 'who'}
            };
        } else {
           result = {
                'style': 'inanimate',
                'query': {'pluralSubject': 'which ' + nounInfo.plural, 'pluralObject': 'which ' + nounInfo.plural, 'singularObject': 'which ' + nounInfo.singular}
            };
        }

        callback(null, result);
    });
}

function capFirst(text) {
    text = text.replace(' the the ', ' the ');
    return textLib.capitalizeFirstLetter(text);
}

function process(triple, callback) {

    var cleanSubject = triple.subject.toLowerCase().replace('_', ' ');
    var cleanRelationship = triple.relationship.toLowerCase().replace('_', ' ')
    var cleanObject = triple.object.toLowerCase().replace('_', ' ');

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
                            'query-subject-plural': capFirst( subjectMetadata.query.pluralSubject + ' have the ' + relationMetadata.phraseTail.singular + ' {O}?'),
                            'query-object-singular': capFirst( objectMetadata.query.singularObject + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.phraseTail.singular + ' of {S}?'),
                            'query-object-plural': capFirst( objectMetadata.query.pluralObject + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.phraseTail.plural + ' of {S}?')
                        };
                    } else if (relationMetadata.phraseTail) {
                        var result = {
                            'query-fact': capFirst( relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-subject-plural': capFirst( subjectMetadata.query.pluralSubject + ' ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-object-singular': capFirst( objectMetadata.query.singularObject + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.query.singularObject + ' of {S}?'),
                            'query-object-plural': capFirst( objectMetadata.query.pluralObject + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.query.pluralObject + ' of {S}?')
                        };
                    }
                    else {

                        var result = {
                            'query-fact': capFirst( relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-subject-plural': capFirst( subjectMetadata.query.pluralSubject + ' ' + relationMetadata.getSubjectQuery() + ' {O}?'),
                            'query-object-singular': capFirst(objectMetadata.query.singularObject + ' ' + relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getObjectQuery() + '?'),
                            'query-object-plural': capFirst(objectMetadata.query.pluralObject + ' ' + relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getPluralObjectQuery() + '?')
                        };
                    }
                } else {
                    var result = {
                        'query-fact': capFirst( relationMetadata.getIsWas() + ' the ' + relationMetadata.getFactQuery() + ' of {S} {O}?'),
                        'query-subject-plural': capFirst( subjectMetadata.query.pluralSubject + ' ' + relationMetadata.getSubjectQuery() + ' ' + relationMetadata.getIsWas() + ' {O}?'),
                        'query-object-singular': capFirst( objectMetadata.query.singularObject + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.getObjectQuery() + ' of {S}?'),
                        'query-object-plural': capFirst( objectMetadata.query.pluralObject + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.getPluralObjectQuery() + ' of {S}?')
                    };
                }

                callback(null, result);

            });
        });

    });
}

module.exports.process = process;
