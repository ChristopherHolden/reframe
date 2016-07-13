

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.substring(1);
}

function isUppercase(char) {
    return char === char.toUpperCase();
}


function splitOnCamelcase(word, result) {
    result.push(word);
    return;
}

function splitWords(text) {
    var temp = text.match(/\S+/g) || [];
    var result = [];
    temp.forEach(function(word) {
        splitOnCamelcase(word, result);
    });

    return result;
}

module.exports.capitalizeFirstLetter = capitalizeFirstLetter
module.exports.splitWords = splitWords;
