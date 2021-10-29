import { 
    joinVoiceChannel, 
    entersState, 
    VoiceConnectionStatus, 
    createAudioPlayer, 
    NoSubscriberBehavior, 
    createAudioResource 
} from '@discordjs/voice'
import { Client, Intents } from 'discord.js'
import { Player as SearchMusic } from 'discord-player'
import ytdl from 'ytdl-core'
import env from 'dotenv'

env.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ], retryLimit: 1, restRequestTimeout: 15000 });

const searchTracks = new SearchMusic(client);

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

    if (!msg.content.startsWith(process.env.PREFIX!)) return;

    if (msg.content.startsWith(process.env.PREFIX! + 'p')) {
        const args: string[] = msg.content.trim().split(' ');
        args.splice(0, 1); // remove prefix

        const { channel } = msg.member!.voice;

        if (!channel) {
            msg.channel.send("Você deve estar em um canal de voz!");
            return;
        }

        const track = await searchTracks.search(args.join(' '), { requestedBy: msg.member!.user }).then(x => x.tracks[0]);

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