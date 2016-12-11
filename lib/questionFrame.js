var lexicalInfo = require('./lexicalInfo');
var textLib = require('./textLib');

var tenses = {
  'present': {}
};

function getConceptMetadata(subject, relationMetadata, callback) {

    subject = subject.toLowerCase();

    lexicalInfo.findNounPlurals(subject, function(err, nounInfo) {

        var result;

        if (subject === 'person') {
            result = {
                'style': 'human',
                'query': {'pluralSubject'  : 'which people',
                          'singularSubject': 'who',
                          'singularObject': 'who',
                          'pluralObject': 'who'},
                'query-attribute':
                         {'pluralSubject'  : 'which people',
                          'singularSubject': 'who\'s'}
            };
        } else {
           result = {
                'style': 'inanimate',
                'query': {'pluralSubject'  : 'which ' + nounInfo.plural,
                          'pluralObject'   : 'which ' + nounInfo.plural,
                          'singularObject' : 'which ' + nounInfo.singular,
                          'singularSubject': 'which ' + nounInfo.singular},
                'query-attribute':
                          {'pluralSubject'  : 'which ' + nounInfo.possessive,
                           'pluralObject'   : 'which ' + nounInfo.possessive,
                           'singularObject' : 'which ' + nounInfo.singular,
                           'singularSubject': 'which ' + nounInfo.possessive}
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

    var cleanSubject = triple.subject.replace('_', ' ');
    var cleanRelationship = triple.relationship.replace('_', ' ')
    var cleanObject = triple.object.replace('_', ' ');

    var tenseHint = null;

    lexicalInfo.lookup(cleanRelationship, function(err, relationMetadata) {
        if(err) {
            return callback(err, null);
        }

        getConceptMetadata(cleanSubject, relationMetadata, function(err, subjectMetadata) {

            getConceptMetadata(cleanObject, relationMetadata, function(err, objectMetadata) {
                if (relationMetadata.isVerb) {

                    if (relationMetadata.isHasVerbPhrase) {
                        if (relationMetadata.tense.past) {
                            var result = {
                                'query-fact': capFirst( relationMetadata.getIsWas() + ' the ' + relationMetadata.phraseTail.singular.toLowerCase() + ' of {S} {O}?'),
                                'query-subject-plural' : capFirst( subjectMetadata.query.pluralSubject + ' ' + relationMetadata.pluralHas + ' a ' + relationMetadata.phraseTail.singular.toLowerCase() + ' of {O}?'),
                                'query-subject-singular' : capFirst( subjectMetadata.query.singularSubject + ' ' + relationMetadata.singularHas + ' a ' + relationMetadata.phraseTail.singular + ' of {O}?'),
                                'query-object-singular': capFirst( objectMetadata.query.singularObject + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.phraseTail.singular + ' of {S}?'),
                                'query-object-plural'  : capFirst( objectMetadata.query.pluralObject + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.phraseTail.plural + ' of {S}?')
                            };

                        } else {
                            var result = {
                                'query-fact': capFirst( relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getFactQuery() + ' {O}?'),
                                'query-subject-plural' : capFirst( subjectMetadata.query.pluralSubject + ' ' + relationMetadata.pluralHas + ' the ' + relationMetadata.phraseTail.singular + ' {O}?'),
                                'query-subject-singular' : capFirst( subjectMetadata.query.singularSubject + ' ' + relationMetadata.singularHas + ' the ' + relationMetadata.phraseTail.singular + ' {O}?'),
                                'query-object-singular': capFirst( objectMetadata.query.singularObject + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.phraseTail.singular + ' of {S}?'),
                                'query-object-plural'  : capFirst( objectMetadata.query.pluralObject + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.phraseTail.plural + ' of {S}?')
                            };
                        }
                    } else if (relationMetadata.phraseTail) {
                        var result = {
                            'query-fact': capFirst( relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-subject-plural' : capFirst( subjectMetadata.query.pluralSubject + ' ' + relationMetadata.getPluralSubjectQuery() + ' {O}?'),
                            'query-subject-singular' : capFirst( subjectMetadata.query.singularSubject + ' ' + relationMetadata.getSubjectQuery() + ' {O}?'),
                            'query-object-singular': capFirst( objectMetadata.query.singularObject + ' ' + relationMetadata.getIsWas() + ' ' + relationMetadata.query.singularObject + ' by {S}?'),
                            'query-object-plural'  : capFirst( objectMetadata.query.pluralObject + ' ' + relationMetadata.getPluralIsWas() + ' ' + relationMetadata.query.pluralObject + ' by {S}?')
                        };
                    }
                    else {

                        var result = {
                            'query-fact': capFirst( relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getFactQuery() + ' {O}?'),
                            'query-subject-plural': capFirst( subjectMetadata.query.pluralSubject + ' ' + relationMetadata.getPluralSubjectQuery() + ' {O}?'),
                            'query-subject-singular': capFirst( subjectMetadata.query.singularSubject + ' ' + relationMetadata.getSubjectQuery() + ' {O}?'),
                            'query-object-singular': capFirst(objectMetadata.query.singularObject + ' ' + relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getObjectQuery() + '?'),
                            'query-object-plural': capFirst(objectMetadata.query.pluralObject + ' ' + relationMetadata.getDoesDid() + ' {S} ' + relationMetadata.getPluralObjectQuery() + '?')
                        };
                    }
                } else {
                    var result = {
                        'query-fact': capFirst( relationMetadata.getIsWas() + ' the ' + relationMetadata.getFactQuery() + ' of {S} {O}?'),
                        'query-subject-plural': capFirst( subjectMetadata['query'].pluralSubject + ' ' + relationMetadata.pluralHas +' a ' + relationMetadata.getSubjectQuery() + ' of {O}?'),
                        'query-subject-singular': capFirst( subjectMetadata['query'].singularSubject + ' ' + relationMetadata.singularHas + ' a ' + relationMetadata.getSubjectQuery() + ' of {O}?'),
                        'query-object-singular': capFirst( objectMetadata['query-attribute'].singularObject + ' ' + relationMetadata.getIsWas() + ' the ' + relationMetadata.getObjectQuery() + ' of {S}?'),
                        'query-object-plural': capFirst( objectMetadata['query'].pluralObject + ' ' + relationMetadata.getPluralIsWas() + ' the ' + relationMetadata.getPluralObjectQuery() + ' of {S}?')
                    };
                }

                callback(null, result);

            });
        });

    });
}

module.exports.process = process;
