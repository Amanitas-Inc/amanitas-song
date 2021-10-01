const { Client, Intents, VoiceChannel } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
// const { getVoiceConnection } = require('@discordjs/voice');
const env = require('dotenv').config()

const prefix = '.';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ], retryLimit: 1, restRequestTimeout: 15000 });

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

        const { channel } = msg.member.voice;

        if (!channel) {
            console.log("voce deve estar em chat de voz");
            return;
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        entersState(connection, VoiceConnectionStatus.Ready, 30e3);

        // voice.channel.join();

    }
});

client.login(process.env.BOT_TOKEN).catch((e) => console.log(e));