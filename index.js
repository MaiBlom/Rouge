const Discord = require('discord.js');
const { BOTTOKEN } = require('./token.js');

const bot = new Discord.Client({ 
    partials: ['MESSAGE', 'CHANNEL'],
    ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] }
  });

bot.login(BOTTOKEN);