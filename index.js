const { Client, Intents } = require('discord.js');
const env = require('dotenv').config()

const prefix = '.';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ], retryLimit: 1, restRequestTimeout: 15000 });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', msg => {
    if (msg.author.bot) return;

    if (!msg.content.startsWith(prefix)) return;

    if (msg.content.startsWith(prefix + 'p')) {
        msg.channel.send('você digitou: ');

        const args = msg.content.trim().split(' ');
        args.splice(0, 1);
        msg.channel.send(args.join(' '));
    }
});

client.login(process.env.BOT_TOKEN).catch((e) => console.log(e));