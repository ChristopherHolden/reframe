var expect = require('chai').expect;

var lib = require('../../lib/textLib');

describe('textLib', function() {

    it('should handle a blank string', function(done) {
        var result = lib.splitWords('');
        expect(result).to.eql([]);

        done();
    });

    it('should handle non camel case', function(done) {
        var result = lib.splitWords('some plain words');
        expect(result).to.eql(['some', 'plain', 'words']);

        done();
    });

    it ('should handle aCamelCasePhrase', function(done) {
        var result = lib.splitWords('aCamelCasePhrase');
        expect(result).to.eql(['a','camel', 'case', 'phrase']);

        done();
    });

    it ('should handle aMixed bag', function(done) {
        var result = lib.splitWords('should handle aMixed bag');
        expect(result).to.eql(['should','handle', 'a', 'mixed', 'bag']);

        done();
    });


});

