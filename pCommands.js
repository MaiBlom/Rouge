var { pokemons, pokeInts, pokemonPool, userFiles } = require('./index.js');
var fs = require("fs");

module.exports = {
    pokeRoll: function(bot, channel, msgMemberID) {
        
    },
    
    // msgMemberID formatting.
    pokedex: function(bot, channel, msgMemberID) {
        var memberPokemons = [];
        fs.readFile(`./DATA/${msgMemberID}.txt`, "utf-8", (err, data) => {
            if (err) { console.log(err) }
            memberPokemons = data.split(/(?:;| |\r|\n)+/);
            console.log(`${msgMemberID}'s pokemons: \n${memberPokemons}`);
            
        });
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