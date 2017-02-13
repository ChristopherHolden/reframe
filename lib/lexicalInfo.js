// Simple wrapper around wordnet (or other).

var pluralize = require('pluralize');
var textLib = require('./textLib');

var lexicon = require('corefoo-nlp').lexicon;

function findNounPlurals (suspectedNoun, callback) {

    var plural = pluralize.plural(suspectedNoun);
    var singularTest = pluralize.plural(plural, 1);

    var singular = suspectedNoun;
    if (singularTest != plural) {
        singular = singularTest;
    }

    callback(null, {'singular': singular.toLowerCase(), 'plural': plural.toLowerCase(), 'possessive': singular.toLowerCase() + '\'s'});
}

function getSingularPluralInfo(word) {
    var plural = pluralize.plural(word);
    var singularTest = pluralize.plural(plural, 1);

    var singular = word;
    if (singularTest != plural) {
        singular = singularTest;
    }
    return {'singular': singular, 'plural': plural};
}

function getSingularPluralVariants(words) {
    var singular = [];
    var plural = [];

    words.forEach(function(word) {
        var info = getSingularPluralInfo(word);
        singular.push(info.singular);
        plural.push(info.plural);
    });

    return {'singular':singular, 'plural':plural};
}


function pluralizeWords(words) {
    var result = words.slice(0);

    var lastIndex = result.length - 1;

    var plural = pluralize.plural(words[lastIndex]);
    var singularTest = pluralize.plural(plural, 1);

    var singular = words[lastIndex];
    if (singularTest != plural) {
        singular = singularTest;
    }

    result[lastIndex] = singular;
    var singularVariation = result.join(' ');

    result[lastIndex] = plural;
    var pluralVariation = result.join(' ');

    return {
        'singular': singularVariation,
        'plural' : pluralVariation
    };
}


function buildVerbResult(verb, word) {

    var presentTense = word === verb.actorCurrently;

    return {
        'isVerb': true,
        'isHasVerbPhrase': false,
        'verbRoot': verb.to,
        'tense': {current: presentTense},
        'getDoesDid': function() {
            return presentTense ? 'does' : 'did';
        },
        'getIsWas': function () {
            return presentTense ? 'is' : 'was';
        },
        'getPluralIsWas': function () {
            return presentTense ? 'are' : 'were';
        },
        'getFactQuery': function() {
            return verb.actorWill;
        },
        'getSubjectQuery': function() {
            return presentTense ?  verb.actorCurrently : verb.actorOnce;
         },
        'getPluralSubjectQuery': function () {
            return presentTense ? verb.actorWill : verb.actorOnce;
        },
        'getObjectQuery' : function() {
            return verb.actorWill;
        },
        'getPluralObjectQuery': function() {
            return verb.actorWill;
        }
    };
}

function substitute(list, index, newItem) {
    var result = list.slice(0); // clone
    result[index] = newItem;

    return result;
}

function buildVerbPhraseResult(verb, words, verbIndex) {

    words = words.map(function(w) { return w.toLowerCase()});

    var word = words.join(' ');
    var presentTense = words[verbIndex] === verb.actorCurrently;
    var pastTense = words[verbIndex] === verb.actorHas;
    var phraseTail =  words.slice(1);
    var isHasVerbPhrase = verb.actorCurrently === 'has';

    var wordVariants = getSingularPluralVariants(words);

    if (isHasVerbPhrase) {
        var pluralObject = pluralizeWords(phraseTail).plural;
    } else {
        var pluralObject = substitute(wordVariants.singular, verbIndex, verb.actorOnce).join(' '); // + ' ' + pluralizeWords(phraseTail).plural;
    }
    var singularObject = substitute(wordVariants.singular, verbIndex, verb.objectIsBeing).join(' '); // + ' ' + pluralizeWords(phraseTail).singular;


    return {
        'isVerb': true,
        'isHasVerbPhrase': isHasVerbPhrase,
        'pluralHas': presentTense ? 'have' : 'had',
        'singularHas': presentTense ? 'has' : 'had',
        'verbRoot': verb.to,
        'phraseTail': pluralizeWords(phraseTail),
        'tense': {current: presentTense, past: pastTense},
        'query': {'pluralObject': pluralObject, 'singularObject': singularObject},
        'getDoesDid': function() {
            return presentTense ? 'does' : 'did';
        },
        'getIsWas': function () {
            return presentTense ? 'is' : 'was';
        },
        'getPluralIsWas': function () {
            return presentTense ? 'are' : 'were';
        },
        'getFactQuery': function() {
            // removed past tense option.
            return substitute(words, verbIndex, verb.actorWill).join(' ');// + ' ' + phraseTail.join(' ');
        },
        'getSubjectQuery': function() {
            return substitute(words, verbIndex, (presentTense ?  verb.actorCurrently : verb.actorOnce)).join(' '); // + ' ' + phraseTail.join(' ');
        },
        'getPluralSubjectQuery': function() {
            return substitute(words, verbIndex,pastTense? verb.actorOnce :  verb.actorWill).join(' '); //words.join(' ');
        },
        'getObjectQuery' : function() {
            return words.join(' ');
        },
        'getPluralObjectQuery': function() {
            // TODO singular - pluralize.
            return phraseTail.join(' ');
        }
    };
}

function pluralizePropertyWords(propertyWords) {

    return propertyWords.join(' ') + 's';
}

function buildGenericPropertyResult(propertySource, keywordIndex, keywordData) {

    var propertyWords = textLib.splitWords(propertySource);

    var presentTense = false;
    if (propertyWords.length > 0 && propertyWords[0] === 'has') {
        presentTense = true;
        propertyWords.shift();
    }

    // if no tense
    if (presentTense === false) {
        presentTense = true;
    }

    var propertyName = propertyWords.join(' ');
    var pluralPropertyName = pluralizePropertyWords(propertyWords);
     var subjectQuery = propertyName;
    var objectQuery = propertyName;

    var factQuery = propertyName;
    if (keywordData && keywordData.canBeAdjective) {
        var pluralisedWords = getSingularPluralVariants(propertyWords);
        var pluralQuestionWords = substitute(pluralisedWords.plural, keywordIndex, keywordData.actorOnce);
        pluralPropertyName = pluralQuestionWords.join(' ');

        factQuery = substitute(pluralisedWords.singular, keywordIndex, keywordData.actorOnce).join(' ');
        subjectQuery = substitute(pluralisedWords.singular, keywordIndex, keywordData.actorOnce).join(' ');
        objectQuery = substitute(pluralisedWords.singular, keywordIndex, keywordData.actorOnce).join(' ');
    }

    return {
        'isVerb': false,
        'isHasVerbPhrase': false,
        'pluralHas': presentTense ? 'have' : 'had',
        'singularHas': presentTense ? 'has' : 'had',
        'getDoesDid': function() {
            return presentTense ? 'does' : 'did';
        },
        'getIsWas': function () {
            return presentTense ? 'is' : 'was';
        },
        'getPluralIsWas': function () {
            return presentTense ? 'are' : 'were';
        },
        'getFactQuery': function () {
            return factQuery;
        },
        'getSubjectQuery': function () {
            return subjectQuery;
        },
        'getObjectQuery': function () {
            return objectQuery;
        },
        'getPluralObjectQuery': function() {
            return pluralPropertyName
        }
    }
}

function findVerbIndex (words) {
    var index = -1;
    var testIndex = 0;

    words.forEach(function(word) {
        if (lexicon.getVerbInfo(word)){
            index = testIndex;
        }
        testIndex++;
    });

    return index;
}

function lookup(word, callback) {

    var cleanSingleWord = word.toLowerCase();
    var verb = lexicon.getVerbInfo(cleanSingleWord);
    var verbData;

    if (verb) {
        callback(null, buildVerbResult(verb, cleanSingleWord));
    } else {
        var words = textLib.splitWords(word);
        var verbIndex = findVerbIndex(words);

        var isAdjective = false;
        if (verbIndex === 0 && words.length > 1) {
            var verbData = lexicon.getVerbInfo(words[verbIndex]);
            if (verbData.canBeAdjective) {
                isAdjective = true;
            }
        }

        if (verbIndex != -1 && !isAdjective) {
            verb = lexicon.getVerbInfo(words[verbIndex])
            callback(null, buildVerbPhraseResult(verb, words, verbIndex))
        } else {
            callback(null, buildGenericPropertyResult(word, verbIndex, verbData));
        }
    }
}

module.exports.lookup = lookup;
module.exports.findNounPlurals = findNounPlurals;
