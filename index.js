require("dotenv").config(); //to start process from .env file
const {Discord, EmbedBuilder, Client, Intents, GatewayIntentBits}=require("discord.js");
const schedule = require('node-schedule');
const client=new Client({
    intents:[
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ]
});
client.once("ready", () =>{
    console.log("BOT IS ONLINE"); //message when bot is online
})

schedule.scheduleJob('0 17 * * 5', () => { 
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


client.login(process.env.TOKEN);
