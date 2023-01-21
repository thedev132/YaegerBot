const cron = require('node-cron');
require("dotenv").config(); //to start process from .env file
const {Discord, EmbedBuilder, Client, Intents, GatewayIntentBits}=require("discord.js");
const schedule = require('node-schedule');
const client = new Client({ intents: [ 
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,] });

cron.schedule('0 17 * * 5', () => { 
    var servers = client.guilds.cache.map(guild => guild);
    var bandServer = servers[0]
    var practiceLogChannel= client.channels.cache.find(channel => channel.name === "practice-logs-are-due").id;
    var practiceLogRole = bandServer.roles.cache.find(r => r.name === 'practice log reminders').id;
    var messageEmbed = new EmbedBuilder()
        .setColor('0x00FFFF')
        .setTitle(`PRACTICE LOGS ARE DUE TONIGHT`)
        .setDescription(`Complete your practice logs tonight or else it will be late!`)

    client.channels.fetch(practiceLogChannel).then((channel) => {
        channel.send({embeds: [messageEmbed], content: `\n <@&${practiceLogRole}>`});
    });
 }) // run every Friday at 5pm

const prefix = "!"
client.once("ready", () =>{
    console.log("BOT IS ONLINE"); //message when bot is online
})

async function getPlayers() {
    const response = await fetch("https://api.minetools.eu/ping/cmsband.cluster.ws")
    const data = await response.json();
    const sample = data.players.sample
    var playerNames = []
    sample.forEach(element => {
        playerNames.push(element.name)
    }); 
    return playerNames
}

client.on("messageCreate", message => {
    if(message.content.startsWith(`${prefix}players`)){
        getPlayers().then(function(response){
            var playerNames = "Players online are: \n"
            response.forEach(function(element) {
                playerNames += `**${element}**\n`
            })

            
            if (response.length == 0) {
                var messageEmbed = new EmbedBuilder()
                .setColor('#ED4245')
                .setTitle(`No Online Players`)
                .setDescription(`There are no online players at the moment!`)
                message.channel.send({embeds: [messageEmbed]})
            }
            else if (response.length > 0) {
                var messageEmbed = new EmbedBuilder()
                .setColor('#57F287')
                .setTitle(`Online Players`)
                .setDescription(`${playerNames}`)
                message.channel.send({embeds: [messageEmbed]})
            }

        })

        

    } else if (message.content.startsWith(prefix + "avatar")) {
        message.reply(message.author.avatarURL);

    }
})




client.login(process.env.TOKEN);
