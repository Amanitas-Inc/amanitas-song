const { Client, Intents, MessageEmbed } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { Player } = require("discord-player");
const env = require('dotenv').config()
const ytdl = require('ytdl-core')
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

const prefix = '-';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ], retryLimit: 1, restRequestTimeout: 15000 });

const searchTracks = new Player(client);
searchTracks.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`))

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

        const track = searchTracks.search('mc poze anos 80', { requestedBy: msg.member.user }).then(x => x.tracks[0]);

        const args = msg.content.trim().split(' ');
        args.splice(0, 1);
        msg.channel.send(args.join(' '));

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

        // connection.subscribe(player);

        // const queue = player.createQueue(msg.guild, {
        //     metadata: {
        //         channel: msg.channel
        //     }
        // });

        const stream = ytdl('https://www.youtube.com/watch?v=WZIGwN-5Ioo', { filter : 'audioonly' })//.pipe(fs.createWriteStream('music_bot.mp3'));
        const resource = createAudioResource(stream);

        player.play(resource)
        connection.subscribe(player)

        // connection.on(VoiceConnectionStatus.Ready, () => {
        //     console.log('oi')
        //     // try {
        //     //     if (!queue.connection) queue.connect(msg.member.voice.channel);
        //     //     //console.log('conectado')
        //     // } catch {
        //     //     queue.destroy();
        //     //     return msg.reply({ content: "Could not join your voice channel!", ephemeral: true });
        //     // }
        // });

        // queue.play(track);
    }

    // const { MessageEmbed } = require('discord.js');
    // module.exports = function help(msg) {
    if (msg.content.startsWith(prefix + 'help') || msg.content.startsWith(prefix + 'ajuda')) {
        const embed = new MessageEmbed()
        .setTitle('Comandos do nosso bot')
        .setDescription(`
  
          **-ajuda, -help ou -comandos** - Mostra todos os comandos do nosso bot;
  
          **-play ou -p (nome ou link da música)** - Coloca a música na sala que você estiver conectado ;
  
          **-skip ou -s ** - Pula para próxima música;
  
          **-stop** - Para o bot;
  
          **-list** - Lista das músicas que estão na fila;
        `);

        msg.channel.send(embed);
    }
    
});


client.login(process.env.BOT_TOKEN).catch((e) => console.log(e));