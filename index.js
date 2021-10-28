const { Client, Intents, MessageEmbed } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { Player } = require("discord-player");
const env = require('dotenv').config()
const ytdl = require('ytdl-core')
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

const prefix = '-';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ], retryLimit: 1, restRequestTimeout: 15000 });

const searchTracks = new Player(client);

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async msg => {
    if (msg.author.bot) return;

    if (!msg.content.startsWith(prefix)) return;

    if (msg.content.startsWith(prefix + 'p')) {
        msg.channel.send('você digitou: ');

        const args = msg.content.trim().split(' ');
        args.splice(0, 1); // remove prefix

        const track = await searchTracks.search(args.join(' '), { requestedBy: msg.member.user }).then(x => x.tracks[0]);

        const { channel } = msg.member.voice;

        if (!channel) {
            msg.channel.send("voce deve estar em chat de voz");
            return;
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        entersState(connection, VoiceConnectionStatus.Ready, 30e3);

        const stream = ytdl(track.url, { filter : 'audioonly' });
        const resource = createAudioResource(stream);

        player.play(resource);
        connection.subscribe(player);
    }
});


client.login(process.env.BOT_TOKEN).catch((e) => console.log(e));