import { Client, GatewayIntentBits, PresenceUpdateStatus, ActivityType } from 'discord.js';
import * as info from './package.json';
import { config } from 'dotenv';
import { getSize, getFlags, sortPackages } from './handlers/functions';

config();

const client = new Client({
    shards: "auto",
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildPresences
    ],
    presence: {
        activities: [{
            name: `Discord-Web-API v${info.version}`,
            type: ActivityType.Streaming,
            url: "https://www.twitch.tv/hitomihiumi"
        }],
        status: PresenceUpdateStatus.Online
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

process.on('unhandledRejection', (reason, p) => {
    console.log(' [antiCrash] :: Unhandled Rejection/Catch');
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(' [antiCrash] :: Uncaught Exception/Catch');
    console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
    console.log(err, origin);
});

client.login(process.env.TOKEN);

export { client };