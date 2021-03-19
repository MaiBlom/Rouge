const Discord = require('discord.js');
var fs = require("fs");
//const { Console } = require('console');

module.exports = {
    pokeRoll: function(bot, channel, msgMemberID, msgUserObj, pokemons, pokemonInts, pokemonPool) {
        let rollNum = getRandomInt(1, pokemonPool);

        let curPos = 0;
        var rollPokemon;

        for(i = 0; i < pokemons.length - 1; i++) {
            if(rollNum >= curPos && rollNum <= curPos + parseInt(pokemonInts[i])) {
                rollPokemon = pokemons[i].join();
                if(getRandomInt(1, 1000) >= 999) rollPokemon = '$' + rollPokemon;
                break;
            }
            curPos += parseInt(pokemonInts[i]);
        }
        
        fs.readFile(`./DATA/${msgMemberID}.txt`, 'utf-8', (err, data) => {
            if(err) console.log(err);
            if(data.includes(rollPokemon)) {
                var indexOfNum = data.indexOf(rollPokemon) + rollPokemon.length + 1;

                var numOfPokemon = parseInt(data.charAt(indexOfNum) + data.charAt(indexOfNum + 1) + data.charAt(indexOfNum + 2));
                numOfPokemon++;
                numOfPokemon = numOfPokemon.toString();

                if(numOfPokemon.length === 1) numOfPokemon = '00' + numOfPokemon;
                else if(numOfPokemon.length === 2) numOfPokemon = '0' + numOfPokemon;

                data = setCharAt(data, indexOfNum, numOfPokemon.charAt(0));
                data = setCharAt(data, indexOfNum + 1, numOfPokemon.charAt(1));
                data = setCharAt(data, indexOfNum + 2, numOfPokemon.charAt(2));

                fs.writeFile(`./DATA/${msgMemberID}.txt`, data, 'utf-8', err => { if(err) console.log(err); })
            } else {
                data += rollPokemon + ',001;';
                fs.writeFile(`./DATA/${msgMemberID}.txt`, data, 'utf-8', err => { if(err) console.log(err); })
            }
        });

        bot.channels.cache.get(channel).send(`**${msgUserObj.username}** caught **${rollPokemon}**!`);
    },
    
    pokedex: function(bot, channel, msgMemberID, msgUserObj, memberPokemons) {
        let fieldArray = [];

        if(memberPokemons.length == 0) 
            fieldArray.push('Empty Pokedex');
        else
            for(i = 0; i < 10 && i < memberPokemons.length; i++) {
                let pokemonShiny = false;
                if(memberPokemons[i].charAt(0) === '$') {
                    pokemonShiny = true;
                    memberPokemons[i] = memberPokemons[i].substring(1);
                }
                let pokemonType = memberPokemons[i].split(',')[0];
                let pokemonAmount = parseInt(memberPokemons[i].split(',')[1]);
                if(pokemonShiny)
                    fieldArray.push(`${pokemonAmount}x :sparkles:${pokemonType}`);
                else
                    fieldArray.push(`${pokemonAmount}x ${pokemonType}`);
            }

        const pokedexEmbed = new Discord.MessageEmbed()
            .setColor('#8f1255')
            .setTitle(`${msgUserObj.username}\'s pokedex`)
            .setThumbnail(msgUserObj.avatarURL())
            .setDescription(fieldArray)
            .setTimestamp()
            .setFooter(`0/${Math.ceil(memberPokemons.length / 10)}`);

        bot.channels.cache.get(channel).send(pokedexEmbed).then(s => { s.react('◀'); s.react('▶'); });
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

// Replaces a particular char at an index in a String.
function setCharAt(str, index, chr) {
    if(index > str.length-1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}