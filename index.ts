import { Client, Intents } from 'discord.js';
import { Player } from 'discord-player';
import env from 'dotenv';

env.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ], retryLimit: 1, restRequestTimeout: 15000 });

const player = new Player(client, { ytdlOptions: { filter: 'audioonly' } });

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

    if (args.join(' ') === '') return;

    const track = await player.search(args.join(' '), { requestedBy: msg.member!.user }).then(x => x.tracks[0]);

    if (track === undefined) {
      msg.channel.send('Não consegui encontrar o som, tente novamente!');
      return;
    }

    const queue = player.createQueue(msg.guild!, { metadata: msg.channel });

    try {
      if (!queue.connection) await queue.connect(msg.member?.voice.channel!);
    } catch {
      console.log('Não consigo conectar!');
      return;
    }

    queue.addTrack(track);

    msg.channel.send(`A música ${track.title} foi adicionada à fila`)

    if (!queue.playing) await queue.play();
  }
});

client.login(process.env.BOT_TOKEN).catch((e) => console.log(e));
