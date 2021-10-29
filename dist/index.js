"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var voice_1 = require("@discordjs/voice");
var discord_js_1 = require("discord.js");
var discord_player_1 = require("discord-player");
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES], retryLimit: 1, restRequestTimeout: 15000 });
var searchTracks = new discord_player_1.Player(client);
var player = (0, voice_1.createAudioPlayer)({
    behaviors: {
        noSubscriber: voice_1.NoSubscriberBehavior.Pause,
    },
});
client.once('ready', function () {
    console.log('Ready!');
});
client.on('messageCreate', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, channel, track, connection, stream, resource;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (msg.author.bot)
                    return [2 /*return*/];
                if (!msg.content.startsWith(process.env.PREFIX))
                    return [2 /*return*/];
                if (!msg.content.startsWith(process.env.PREFIX + 'p')) return [3 /*break*/, 2];
                args = msg.content.trim().split(' ');
                args.splice(0, 1); // remove prefix
                channel = msg.member.voice.channel;
                if (!channel) {
                    msg.channel.send("Você deve estar em um canal de voz!");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, searchTracks.search(args.join(' '), { requestedBy: msg.member.user }).then(function (x) { return x.tracks[0]; })];
            case 1:
                track = _a.sent();
                connection = (0, voice_1.joinVoiceChannel)({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Ready, 30e3);
                stream = (0, ytdl_core_1.default)(track.url, { filter: 'audioonly' });
                resource = (0, voice_1.createAudioResource)(stream);
                player.play(resource);
                connection.subscribe(player);
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
client.login(process.env.BOT_TOKEN).catch(function (e) { return console.log(e); });
