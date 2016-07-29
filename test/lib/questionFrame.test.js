var expect = require('chai').expect;

var lib = require('../../lib/questionFrame');

// http://www.corefoo.org:8888/reframe/plant/prefers/climate

describe('questionFrame', function() {

    it('should process the speaks triple', function(done) {

        lib.process({
            'subject':'Person',
            'relationship': 'Speaks',
            'object': 'Language'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Does {S} speak {O}?');
            expect(result['query-subject-plural']).to.equal('Which people speak {O}?');
            expect(result['query-subject-singular']).to.equal('Who speaks {O}?');
            expect(result['query-object-singular']).to.equal('Which language does {S} speak?');
            expect(result['query-object-plural']).to.equal('Which languages does {S} speak?');

            done();
        });
    });

    it('should process the has-national-language triple', function(done) {

        lib.process({
            'subject':'Country',
            'relationship': 'has national language',
            'object': 'Language'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Does {S} have national language {O}?');
            expect(result['query-subject-plural']).to.equal('Which countries have the national language {O}?');
            expect(result['query-subject-singular']).to.equal('Which country has the national language {O}?');
            expect(result['query-object-singular']).to.equal('Which language is the national language of {S}?');
            expect(result['query-object-plural']).to.equal('Which languages are the national languages of {S}?');

            done();
        });
    });

    it('should process the visited triple', function(done) {

        lib.process({
            'subject':'Space Probe',
            'relationship': 'visited',
            'object': 'body'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Did {S} visit {O}?');
            expect(result['query-subject-plural']).to.equal('Which space probes visited {O}?');
            expect(result['query-subject-singular']).to.equal('Which space probe visited {O}?');
            expect(result['query-object-singular']).to.equal('Which body did {S} visit?');
            expect(result['query-object-plural']).to.equal('Which bodies did {S} visit?');

            done();
        });
    });

    it('should process the visited triple with underscores', function(done) {

        lib.process({
            'subject':'Space_Probe',
            'relationship': 'recently_visited',
            'object': 'heavenly_body'}, function(err, result) {

            expect(err).to.not.be.ok;
            // TODO
            expect(result['query-fact']).to.equal('Did {S} recently visit {O}?');
            expect(result['query-subject-plural']).to.equal('Which space probes recently visited {O}?');
            expect(result['query-subject-singular']).to.equal('Which space probe recently visited {O}?');
            expect(result['query-object-singular']).to.equal('Which heavenly body was recently visited by {S}?');
            expect(result['query-object-plural']).to.equal('Which heavenly bodies were recently visited by {S}?');

            done();
        });
    });

//    batteryType takenBy product
 //todo   batteryTime isTakenBy product
// person willEat food

    it('should process a simple person verb triple', function(done) {

        lib.process({
            'subject':'Person',
            'relationship': 'Likes',
            'object': 'Food'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Does {S} like {O}?');
            expect(result['query-subject-plural']).to.equal('Which people like {O}?');
            expect(result['query-subject-singular']).to.equal('Who likes {O}?');
            expect(result['query-object-singular']).to.equal('Which food does {S} like?');
            expect(result['query-object-plural']).to.equal('Which foods does {S} like?');

            done();
        });
    });

    it('should handle - does tomato climate hot?', function(done) {

        lib.process({
            'subject':'Plant',
            'relationship': 'climate',
            'object': 'Temp'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Is the climate of {S} {O}?');
            expect(result['query-subject-plural']).to.equal('Which plants have a climate of {O}?'); // todo
            expect(result['query-subject-singular']).to.equal('Which plant has a climate of {O}?');

            expect(result['query-object-singular']).to.equal('Which temp is the climate of {S}?');
            expect(result['query-object-plural']).to.equal('Which temps are the climates of {S}?');

            done();
        });
    });

    it('should handle - does tomato prefer climate hot?', function(done) {

        lib.process({
            'subject':'Plant',
            'relationship': 'prefers climate',
            'object': 'Temperature'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Is the preferred climate of {S} {O}?');
            expect(result['query-subject-plural']).to.equal('Which plants have a preferred climate of {O}?');
            expect(result['query-subject-singular']).to.equal('Which plant has a preferred climate of {O}?');

            expect(result['query-object-singular']).to.equal('Which temperature is the preferred climate of {S}?');
            expect(result['query-object-plural']).to.equal('Which temperatures are the preferred climates of {S}?');

            done();
        });
    });

    it('should handle - does tomato preferred climate hot?', function(done) {

        lib.process({
            'subject':'Plant',
            'relationship': 'preferred climate',
            'object': 'Temperature'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Is the preferred climate of {S} {O}?');
            expect(result['query-subject-plural']).to.equal('Which plants have a preferred climate of {O}?');
            expect(result['query-subject-singular']).to.equal('Which plant has a preferred climate of {O}?');

            expect(result['query-object-singular']).to.equal('Which temperature is the preferred climate of {S}?');
            expect(result['query-object-plural']).to.equal('Which temperatures are the preferred climates of {S}?');

            done();
        });
    });

    it('should process a simple person-property triple', function(done) {

        lib.process({
            'subject':'Person',
            'relationship': 'shoe size',
            'object': 'size'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Is the shoe size of {S} {O}?');
            expect(result['query-subject-plural']).to.equal('Which people have a shoe size of {O}?');
            expect(result['query-subject-singular']).to.equal('Who has a shoe size of {O}?');

            expect(result['query-object-singular']).to.equal('Which size is the shoe size of {S}?');
            expect(result['query-object-plural']).to.equal('Which sizes are the shoe sizes of {S}?');

            done();
        });
    });

    it('should process a past-tense inanimate-property triple', function(done) {

        lib.process({
            'subject':'Planet',
            'relationship': 'hadDiameter',
            'object': 'size'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Was the diameter of {S} {O}?');
            expect(result['query-subject-plural']).to.equal('Which planets had a diameter of {O}?'); // todo
            expect(result['query-subject-singular']).to.equal('Which planet had a diameter of {O}?');
            expect(result['query-object-singular']).to.equal('Which size was the diameter of {S}?');
            expect(result['query-object-plural']).to.equal('Which sizes were the diameters of {S}?');

            done();
        });
    });



    it('should process a simple inanimate-property triple', function(done) {

        lib.process({
            'subject':'Planet',
            'relationship': 'diameter',
            'object': 'size'}, function(err, result) {

            expect(err).to.not.be.ok;
            expect(result['query-fact']).to.equal('Is the diameter of {S} {O}?');
            expect(result['query-subject-plural']).to.equal('Which planets have a diameter of {O}?'); // todo
            expect(result['query-subject-singular']).to.equal('Which planet has a diameter of {O}?');
            expect(result['query-object-singular']).to.equal('Which size is the diameter of {S}?');
            expect(result['query-object-plural']).to.equal('Which sizes are the diameters of {S}?');

            done();
        });
    });


  //  add tests for everything in SkeletonGraph3.dot

});
