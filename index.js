const Discord = require('discord.js');
const { BOTTOKEN } = require('./token.js');
const dataFolder = './DATA/';
var commands = require('./pCommands.js');
var fs = require('fs');

const bot = new Discord.Client({ 
    partials: ['MESSAGE', 'CHANNEL'],
    ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] }
});

var pokemons = [];
var pokemonInts = [];
var pokemonPool = 0;
var userFiles = [];
bot.on('ready', () => {
    fs.readdir(dataFolder, (err, files) => {
    if (err) { console.log(err) }
        files.forEach(file => { 
        if (file != 'pokemons.txt')
        userFiles.push(file);
    });
});

fs.readFile("./DATA/pokemons.txt", "utf-8", (err, data) => {
    if (err) { console.log(err) }
        pokemonInts = data.split(/(?:;| |\r|\n|,)+/);
        for (i = 0; i < pokemonInts.length - 1; i++) {
            pokemons[i] = pokemonInts.splice(i, 1);
            pokemonPool += parseInt(pokemonInts[i]);
        }
    });
});

bot.on('message', (msg) => {
    if (msg.member.user.bot) return;
    if (msg.content.charAt(0) != '%') return;
    let msgContent = msg.content.split(" ");
    let msgChannel = msg.channel.id;
    let msgMemberID = msg.member.id;
    let msgUserObj = msg.author;
    let memberPokemons = [];

    if(!fs.existsSync(`./DATA/${msgMemberID}.txt`)) {
        fs.writeFile(`./DATA/${msgMemberID}.txt`, '', 'utf-8', err => { console.log(err) });
        bot.channels.cache.get(msgChannel).send(`Welcome **${msgUserObj.username}**! Do \`\`%pd\`\` to check your Pokédex, and \`\`%pr\`\` to roll for Pokémon!`);
        return;
    }

    fs.readFile(`./DATA/${msgMemberID}.txt`, 'utf-8', (err, data) => {
        if(err) console.log(err);
        memberPokemons = data.split(/(?:;| |\r|\n)+/);
        memberPokemons.splice(memberPokemons.length - 1, 1);

        if(msgContent.length === 1 && msgContent[0].charAt(0) === '%') {
            msgContent[0] = msgContent[0].substring(1);

            switch(msgContent[0]) {
                case "pr":
                    commands.pokeRoll(bot, msgChannel, msgMemberID, msgUserObj, pokemons, pokemonInts, pokemonPool);
                    break;
                case "pd":
                    commands.pokedex(bot, msgChannel, msgMemberID, msgUserObj, memberPokemons);
                    break;
            }   
        }
    });

    // console.log(`Message: "${msgContent}" with length ${msgContent.length} \nNickname: ${msgMemberNickName} \nUser ID: ${msgMemberID} \nMessage Channel ID: ${msgChannel}`);
});

bot.on('messageReactionAdd', async (reaction, user) => {
    if(user.bot) return;
    if(reaction.emoji.name !== '◀' && reaction.emoji.name !== '▶') return;
    let msg = reaction.message;
    let reactionMemberID = user.id;
    let memberPokemons = [];
    let oldEmbed = reaction.message.embeds[0];
    let fieldArray = [];

    let previousPage = parseInt(oldEmbed.footer.text.split('/')[0]);
    let newPage = previousPage++;
    let maxPage = parseInt(oldEmbed.footer.text.split('/')[1]);
    console.log(`${previousPage}/${maxPage}`);
    if(maxPage === 0 || maxPage === 1) return;

    // Make this be read before next functions
    fs.readFile(`./DATA/${reactionMemberID}.txt`, 'utf-8', async (err, data) => {
        if(err) console.log(err);
        memberPokemons = data.split(/(?:;| |\r|\n)+/);
        memberPokemons.splice(memberPokemons.length - 1, 1);
        console.log(memberPokemons);
    });

    console.log(memberPokemons);

    if(reaction.emoji.name === '◀' && previousPage > 1) {
        
    } else if(reaction.emoji.name === '◀' && previousPage === 1) {

    } else if(reaction.emoji.name === '▶' && previousPage < maxPage) {
        for(i = newPage * 10; i < (newPage * 10) + 10 && i < memberPokemons.length; i++) {
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
    } else if(reaction.emoji.name === '▶' && previousPage === maxPage) {

    }

    const newEmbed = new Discord.MessageEmbed(oldEmbed)
            .setDescription(fieldArray)
            .setFooter(`${newPage}/${Math.ceil(memberPokemons.length / 10)}`);

    msg.edit(newEmbed);
});

bot.login(BOTTOKEN);