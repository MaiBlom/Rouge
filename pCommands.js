var { pokemons, pokeInts, pokemonPool } = require('./index.js');

module.exports = {
    pokeRoll: function(bot, channel, msgMemberID) {
        
    },
    
    pokedex: function(bot, channel, msgMemberID) {
        
    }
};

// Returns number between 0 and 1.
function getRandom() {
    return Math.random();
}

// Returns random number between the specified values. Greater than or equal to min | Lower than max.
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Returns random Integer between the specified values. Greater than or equal to min | Lower than max.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + Math.ceil(min)));
}