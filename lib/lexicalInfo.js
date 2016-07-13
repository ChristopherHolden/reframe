// Simple wrapper around wordnet (or other).

var pluralize = require('pluralize');
var WordNet = require('node-wordnet');
var textLib = require('./textLib');
var wordnet = new WordNet({'cache': true});

var verbMap = {};



function newVerb() {
    var verb = {
    };
    var target = '';

    return {
        'to': function(word) {
            verb.to = word;
            return this;
        },
        'theActor': function() {
            target = 'theActor';
            return this;
        },
        'theObject': function() {
            target = 'theObject';
            return this;
        },
        'once': function(word) {
            verb.actorOnce = word;
            verbMap[word] = verb;
            return this;
        },
        'was': function(word) {
            if (target === 'theActor') {

                verb.actorWas = word;
            } else if (target === 'theObject') {
                verb.objectWas = word;
            } else {
                throw new Error('Target unknown for [was]');
            }
            verbMap[word] = verb;
            return this;
        },
        'has': function(word) {
            verb.actorHas = word;
            verbMap[word] = verb;
            return this;
        },
        'is': function(word) {
            verb.actorIs = word;
            verbMap[word] = verb;
            return this;
        },
        'currently': function(word) {
            verb.actorCurrently = word;
            verbMap[word] = verb;
            return this;
        },
        'will': function(word) {
            verb.actorWill = word;
            verbMap[word] = verb;
            return this;
        },
        'isBeing': function(word) {
            verb.objectIsBeing = word;
            verbMap[word] = verb;
            return this;
        },
        'willBe': function(word) {
            verb.objectWillBe = word;
            verbMap[word] = verb;
            return this;
        },
    };

}

newVerb().to('go').theActor().once('went').was('going').has('gone').is('going').currently('goes').will('go');

newVerb().to('allow').theActor().once('allowed').has('allowed').is('allowing').currently('allows').will('allow')
    .theObject().was('known').isBeing('known').willBe('known');

newVerb().to('improve').theActor().once('improved').has('improved').is('improving').currently('improves').will('improve')
    .theObject().was('improved').isBeing('improved').willBe('improved');

newVerb().to('visit').theActor().once('visited').has('visited').is('visiting').currently('visits').will('visit')
    .theObject().was('visited').isBeing('visited').willBe('visited');


newVerb().to('protect').theActor().once('protected').has('protected').is('protecting').currently('protects').will('protect')
    .theObject().was('protected').isBeing('protected').willBe('protected');


newVerb().to('delay').theActor().once('delayed').has('delayed').is('delaying').currently('delays').will('delay')
    .theObject().was('delayed').isBeing('delayed').willBe('delayed');



newVerb().to('cause').theActor().once('caused').has('caused').is('causing').currently('causes').will('cause')
    .theObject().was('caused').isBeing('caused').willBe('caused');

newVerb().to('trigger').theActor().once('triggered').has('triggered').is('triggering').currently('triggers').will('trigger')
    .theObject().was('triggered').isBeing('triggered').willBe('triggered');


newVerb().to('eat').theActor().once('ate').has('eaten').is('eating').currently('eats').will('eat')
                 .theObject().was('eaten').isBeing('eaten').willBe('eaten');

newVerb().to('drink').theActor().once('drank').has('drunk').is('drinking').currently('drinks').will('drink')
    .theObject().was('drunk').isBeing('drunk').willBe('drunk');


newVerb().to('have').theActor().once('had').was('having').has('had').is('having').currently('has').will('have');

newVerb().to('speak').theActor().once('spoke').was('speaking').has('spoken').is('speaking').currently('speaks').will('speak');


newVerb().to('say').theActor().once('said').was('saying').has('said').is('saying').currently('says').will('say');

newVerb().to('make').theActor().once('made').has('made').is('making').currently('makes').will('make')
    .theObject().was('made').isBeing('made').willBe('made');

newVerb().to('refuse').theActor().once('refused').has('refused').is('refusing').currently('refuses').will('refuse')
    .theObject().was('refused').isBeing('refused').willBe('refused');

newVerb().to('refer').theActor().once('referred').has('referred').is('referring').currently('refers').will('refer')
    .theObject().was('referred').isBeing('referred').willBe('referred');


newVerb().to('get').theActor().once('got').has('gotten').is('getting').currently('gets').will('get')
    .theObject().was('got').isBeing('gotten').willBe('gotten');

newVerb().to('prefer').theActor().once('preferred').has('preferred').is('preferring').currently('prefers').will('prefer')
    .theObject().was('preferred').isBeing('preferred').willBe('preferred');


newVerb().to('know').theActor().once('knew').has('known').is('knowing').currently('knows').will('know')
    .theObject().was('known').isBeing('known').willBe('known');

newVerb().to('think').theActor().once('thought').has('thought').is('thinking').currently('thinks').will('think')
    .theObject().was('thought').isBeing('thought').willBe('though');

newVerb().to('take').theActor().once('took').has('taken').is('taking').currently('takes').will('take')
    .theObject().was('taken').isBeing('taken').willBe('taken');

newVerb().to('see').theActor().once('saw').has('seen').is('seeing').currently('sees').will('see')
    .theObject().was('seen').isBeing('seen').willBe('seen');

newVerb().to('monitor').theActor().once('monitored').has('monitored').is('monitoring').currently('monitors').will('monitor')
    .theObject().was('monitored').isBeing('monitored').willBe('monitored');

newVerb().to('come').theActor().once('came').has('come').is('coming').currently('comes').will('come');

newVerb().to('control').theActor().once('controlled').has('controlled').is('controlling').currently('controls').will('control')
    .theObject().was('controlled').isBeing('controlled').willBe('controlled');

newVerb().to('like').theActor().once('liked').has('liked').is('liking').currently('likes').will('like')
    .theObject().was('liked').isBeing('liked').willBe('liked');

newVerb().to('commit').theActor().once('committed').has('committed').is('committing').currently('commits').will('commit')
    .theObject().was('committed').isBeing('committed').willBe('committed');

newVerb().to('own').theActor().once('owned').has('owned').is('owning').currently('owns').will('own')
    .theObject().was('owned').isBeing('owned').willBe('owned');

newVerb().to('connect').theActor().once('connected').has('connected').is('connecting').currently('connects').will('connect')
    .theObject().was('connected').isBeing('connected').willBe('connected');

newVerb().to('find').theActor().once('found').has('found').is('finding').currently('finds').will('find')
    .theObject().was('found').isBeing('found').willBe('found');

newVerb().to('give').theActor().once('gave').has('given').is('giving').currently('gives').will('give')
    .theObject().was('given').isBeing('given').willBe('given');

newVerb().to('tell').theActor().once('told').has('told').is('telling').currently('tells').will('tell')
    .theObject().was('told').isBeing('told').willBe('told');

newVerb().to('work').theActor().once('worked').has('worked').is('working').currently('works').will('work')
    .theObject().was('worked').isBeing('worked').willBe('worked');

newVerb().to('call').theActor().once('called').has('called').is('calling').currently('calls').will('call')
    .theObject().was('called').isBeing('called').willBe('called');

newVerb().to('try').theActor().once('tried').has('tried').is('trying').currently('tries').will('try')
    .theObject().was('tried').isBeing('tried').willBe('tried');

newVerb().to('feel').theActor().once('felt').has('felt').is('feeling').currently('feels').will('feel')
    .theObject().was('felt').isBeing('felt').willBe('felt');

newVerb().to('become').theActor().once('became').has('become').is('becoming').currently('becomes').will('become');

newVerb().to('leave').theActor().once('left').has('left').is('leaving').currently('leaves').will('leave')
    .theObject().was('left').isBeing('left').willBe('left');

newVerb().to('lead').theActor().once('lead').has('lead').is('leading').currently('leads').will('lead')
    .theObject().was('lead').isBeing('lead').willBe('lead');


newVerb().to('start').theActor().once('started').has('started').is('starting').currently('starts').will('start')
    .theObject().was('started').isBeing('started').willBe('started');

newVerb().to('include').theActor().once('included').has('included').is('including').currently('includes').will('include')
    .theObject().was('included').isBeing('included').willBe('included');

newVerb().to('claim').theActor().once('claimed').has('claimed').is('claiming').currently('claims').will('claim')
    .theObject().was('claimed').isBeing('claimed').willBe('claimed');

newVerb().to('launch').theActor().once('launched').has('launched').is('launching').currently('launches').will('launch')
    .theObject().was('launched').isBeing('launched').willBe('launched');


newVerb().to('create').theActor().once('created').has('created').is('creating').currently('creates').will('create')
    .theObject().was('created').isBeing('created').willBe('created');

newVerb().to('negate').theActor().once('negated').has('negated').is('negating').currently('negates').will('negate')
    .theObject().was('nagated').isBeing('nagated').willBe('nagated');


newVerb().to('suggest').theActor().once('suggested').has('suggested').is('suggesting').currently('suggests').will('suggest')
    .theObject().was('suggested').isBeing('suggested').willBe('suggested');


newVerb().to('estimate').theActor().once('estimated').has('estimated').is('estimating').currently('estimates').will('estimate')
    .theObject().was('estimated').isBeing('estimated').willBe('estimated');

newVerb().to('employ').theActor().once('employed').has('employed').is('employing').currently('employs').will('employ')
    .theObject().was('employed').isBeing('employed').willBe('employed');


newVerb().to('determine').theActor().once('determined').has('determined').is('determining').currently('determines').will('determine')
    .theObject().was('determined').isBeing('determined').willBe('determined');

newVerb().to('support').theActor().once('supported').has('supported').is('supporting').currently('supports').will('support')
    .theObject().was('supported').isBeing('supported').willBe('supported');


newVerb().to('require').theActor().once('required').has('required').is('requiring').currently('requires').will('require')
    .theObject().was('required').isBeing('required').willBe('required');

newVerb().to('build').theActor().once('built').has('built').is('building').currently('builds').will('build')
    .theObject().was('built').isBeing('built').willBe('built');

newVerb().to('produce').theActor().once('produced').has('produced').is('producing').currently('produces').will('produce')
    .theObject().was('produced').isBeing('produced').willBe('produced');

newVerb().to('grow').theActor().once('grew').has('grown').is('growing').currently('grows').will('grow')
    .theObject().was('grown').isBeing('grown').willBe('grown');

newVerb().to('enable').theActor().once('enabled').has('enabled').is('enabling').currently('enables').will('enable')
    .theObject().was('enabled').isBeing('enabled').willBe('enabled');

newVerb().to('pay').theActor().once('payed').has('payed').is('paying').currently('pays').will('pay')
    .theObject().was('payed').isBeing('payed').willBe('payed');

newVerb().to('cover').theActor().once('covered').has('covered').is('covering').currently('covers').will('cover')
    .theObject().was('covered').isBeing('covered').willBe('covered');

newVerb().to('effect').theActor().once('effected').has('effected').is('effecting').currently('effects').will('effect')
    .theObject().was('effected').isBeing('effected').willBe('effected');


newVerb().to('believe').theActor().once('believed').has('believed').is('believing').currently('believes').will('believe')
    .theObject().was('believed').isBeing('believed').willBe('believed');

newVerb().to('activate').theActor().once('activated').has('activated').is('activating').currently('activates').will('activate')
    .theObject().was('activated').isBeing('activated').willBe('activated');

newVerb().to('deactivate').theActor().once('deactivated').has('deactivated').is('deactivating').currently('deactivates').will('deactivate')
    .theObject().was('deactivated').isBeing('deactivated').willBe('deactivated');

newVerb().to('set').theActor().once('set').has('set').is('setting').currently('sets').will('set')
    .theObject().was('set').isBeing('set').willBe('set');

newVerb().to('accept').theActor().once('accepted').has('accepted').is('accepting').currently('accepts').will('accept')
    .theObject().was('accepted').isBeing('accepted').willBe('accepted');

newVerb().to('fix').theActor().once('fixed').has('fixed').is('fixing').currently('fixes').will('fix')
    .theObject().was('fixed').isBeing('fixed').willBe('fixed');

newVerb().to('approve').theActor().once('approved').has('approved').is('approving').currently('approves').will('approve')
    .theObject().was('approved').isBeing('approved').willBe('approved');

newVerb().to('apply').theActor().once('applied').has('applied').is('applying').currently('applies').will('apply')
    .theObject().was('applied').isBeing('applied').willBe('applied');

newVerb().to('avoid').theActor().once('avoided').has('avoided').is('avoiding').currently('avoids').will('avoid')
    .theObject().was('avoided').isBeing('avoided').willBe('avoided');


newVerb().to('purchase').theActor().once('purchased').has('purchased').is('purchasing').currently('purchases').will('purchase')
    .theObject().was('purchased').isBeing('purchased').willBe('purchased');

newVerb().to('provide').theActor().once('provided').has('provided').is('providing').currently('provides').will('provide')
    .theObject().was('provided').isBeing('provided').willBe('provided');

newVerb().to('identify').theActor().once('identified').has('identified').is('identifying').currently('identifies').will('identify')
    .theObject().was('identified').isBeing('identified').willBe('identified');

newVerb().to('deny').theActor().once('denied').has('denied').is('denying').currently('denies').will('deny')
    .theObject().was('denied').isBeing('denied').willBe('denied');

newVerb().to('mask').theActor().once('masked').has('masked').is('masking').currently('masks').will('mask')
    .theObject().was('masked').isBeing('masked').willBe('masked');


newVerb().to('cancel').theActor().once('cancelled').has('cancelled').is('cancelling').currently('cancels').will('cacel')
    .theObject().was('cancelled').isBeing('cancelled').willBe('cancelled');


newVerb().to('install').theActor().once('installed').has('installed').is('installing').currently('installs').will('install')
    .theObject().was('installed').isBeing('installed').willBe('installed');


newVerb().to('fund').theActor().once('funded').has('funded').is('funding').currently('funds').will('fund')
    .theObject().was('funded').isBeing('funded').willBe('funded');


newVerb().to('increase').theActor().once('increased').has('increased').is('increasing').currently('increases').will('increase')
    .theObject().was('increased').isBeing('increased').willBe('increased');

newVerb().to('guarantee').theActor().once('guaranteed').has('guaranteed').is('guaranteeing').currently('guarantees').will('guarantee')
    .theObject().was('guaranteed').isBeing('guaranteed').willBe('guaranteed');



newVerb().to('decrease').theActor().once('decreased').has('decreased').is('decreasing').currently('decreases').will('decrease')
    .theObject().was('decreased').isBeing('decreased').willBe('decreased');


newVerb().to('sell').theActor().once('sold').has('sold').is('selling').currently('sells').will('sell')
    .theObject().was('sold').isBeing('sold').willBe('sold');

newVerb().to('limit').theActor().once('limited').has('limited').is('limiting').currently('limits').will('limit')
    .theObject().was('limited').isBeing('limited').willBe('limited');




function findNounPlurals (suspectedNoun, callback) {

    var plural = pluralize.plural(suspectedNoun);
    var singularTest = pluralize.plural(plural, 1);

    var singular = suspectedNoun;
    if (singularTest != plural) {
        singular = singularTest;
    }

    callback(null, {'singular': singular, 'plural': plural})
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


function findRoots(word, callback) {

    wordnet.validForms(word, function(err, wordNetResult) {
        if (err) {
            callback(err, null);
        } else {
            var result = {};

            wordNetResult.forEach(function(form) {
                if (form.endsWith('#v')) {
                    result['verbRoot'] = form.substring(0, form.length - 2);
                }
            });

            callback(null, result);
        }
    });
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
        'getObjectQuery' : function() {
            return verb.actorWill;
        },
        'getPluralObjectQuery': function() {
            return verb.actorWill;
        }
    };
}

function buildVerbPhraseResult(verb, words) {

    var word = words.join(' ');
    var presentTense = words[0] === verb.actorCurrently;
    var phraseTail =  words.slice(1);
    var isHasVerbPhrase = verb.actorCurrently === 'has';

    if (isHasVerbPhrase) {
        var pluralObject = pluralizeWords(phraseTail).plural;
    } else {
        var pluralObject = verb.objectIsBeing + ' ' + pluralizeWords(phraseTail).plural;
    }
    var singularObject = verb.objectIsBeing + ' ' + pluralizeWords(phraseTail).singular;


    return {
        'isVerb': true,
        'isHasVerbPhrase': isHasVerbPhrase,
        'verbRoot': verb.to,
        'phraseTail': pluralizeWords(phraseTail),
        'tense': {current: presentTense},
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
            return verb.actorWill + ' ' + phraseTail.join(' ');
        },
        'getSubjectQuery': function() {
            return (presentTense ?  verb.actorCurrently : verb.actorOnce) + ' ' + phraseTail.join(' ');
        },
        'getObjectQuery' : function() {
            // TODO singular - pluralize.
            return phraseTail.join(' ');
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

function buildGenericPropertyResult(propertySource) {

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

    return {
        'isVerb': false,
        'isHasVerbPhrase': false,
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
            return propertyName;
        },
        'getSubjectQuery': function () {
            return propertyName;
        },
        'getObjectQuery': function () {
            return propertyName;
        },
        'getPluralObjectQuery': function() {
            return pluralPropertyName
        }
    }
}

function lookup(word, callback) {

    var verb = verbMap[word];

    if (verb) {
        callback(null, buildVerbResult(verb, word));
    } else {
        var words = textLib.splitWords(word);
        var initialVerb = verbMap[words[0]];
        if (initialVerb) {
            callback(null, buildVerbPhraseResult(initialVerb, words))
        } else {
            callback(null, buildGenericPropertyResult(word));
        }
    }
}

module.exports.findRoots = findRoots;
module.exports.lookup = lookup;
module.exports.findNounPlurals = findNounPlurals;
