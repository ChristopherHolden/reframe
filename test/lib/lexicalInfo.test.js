var expect = require('chai').expect;

var lex = require('../../lib/lexicalInfo');

describe('lexicalInfo', function() {

    describe('findRoots()', function () {

        it('should return the expected data for the word:likes', function(done) {

            lex.findRoots('likes', function(err, result) {
                expect(result.verbRoot).to.equal('like');

                done();
            });
        });

        it('should return the expected data for the word:like', function(done) {

            lex.findRoots('like', function(err, result) {
                expect(result.verbRoot).to.equal('like');

                done();
            });
        });

    });

    describe('lookupRoot()', function () {

        it('should return the expected data for the word:like', function(done) {

            lex.lookup('like', function(err, result) {
                expect(result.isVerb).to.be.ok;
                expect(result.verbRoot).to.equal('like');

                done();
            });
        });


    });

});
