const Discord = require('discord.js');
const { BOTTOKEN } = require('./token.js');
const dataFolder = './DATA/';
var commands = require('./pCommands.js');
var fs = require('fs');

exports.pokemons = pokemons;
exports.pokeInts = dataArr
exports.pokemonPool = pokemonPool;

const bot = new Discord.Client({ 
  partials: ['MESSAGE', 'CHANNEL'],
  ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] }
});

var pokemons = [];
var dataArr = [];
var pokemonPool = 0;

var userFiles = [];
bot.on('ready', () => {
  fs.readdir(dataFolder, (err, files) => {
    files.forEach(file => {
      if (file != 'pokemons.txt')
        userFiles.push(file);
    });
  });

  fs.readFile("./DATA/pokemons.txt", "utf-8", (err, data) => {
    if (err) { console.log(err) }
    dataArr = data.split(/(?:;| |\r|\n|,)+/);
    for (i = 0; i < dataArr.length - 1; i++) {
      pokemons[i] = dataArr.splice(i, 1);
      pokemonPool += parseInt(dataArr[i]);
    }
  });
});

bot.on('message', (msg) => {
  if (msg.member.user.bot) return;
  let msgContent = msg.content.split(" ");
  let msgChannel = msg.channel.id;
  let msgMemberID = msg.member.id;
  let msgMemberNickName = msg.author.tag;

  if(msgContent.length === 1 && msgContent[0].charAt(0) === '%') {
    msgContent[0] = msgContent[0].substring(1);
    switch(msgContent[0]) {
      case "pr":
        commands.pokeRoll(bot, msgChannel, msgMemberID);
        break;
      case "pd":
        commands.pokedex(bot, msgChannel, msgMemberID);
        break;
    }
  }

  console.log(`Message: "${msgContent}" with length ${msgContent.length} \nNickname: ${msgMemberNickName} \nUser ID: ${msgMemberID} \nMessage Channel ID: ${msgChannel}`);
})

bot.login(BOTTOKEN);