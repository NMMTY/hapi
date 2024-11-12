import { api, Query } from "encore.dev/api";
import log from "encore.dev/log";
import { client } from "../../bot";
import { Activity, User } from "discord.js";
import { assetsURL, getFlags, getGuildData } from "../../handlers/functions";
import { User as IUser } from "../../interfaces/DiscordData";

export const get = api(
    { expose: true, method: "GET", path: "/v1/users/:id" },
    async ({ id, query }: { id: string, query?: Query<string> }): Promise<Response> => {
        log.info(`Getting user with id: ${id}`);
        const user = await client.users.fetch(id, { force: true }) as User;

        if (!user) {
            log.error(`User with id ${id} not found in cache.`);
            return { status: 404, error: "User not found" };
        }

        let badges: string[] = [];
        let avatarURL: string = "";
        let bannerURL: string = "";
        let avatarDecorationURL: string = "";

        const data = { ...user, badges, avatarURL, bannerURL, avatarDecorationURL };

        try {
            if (user.flags) data.badges = getFlags(user.flags.toArray());
            if (user.avatarURL({ size: 4096 })) data.avatarURL = user.avatarURL({ size: 4096 }) as string;
            if (user.bannerURL({ size: 4096 })) data.bannerURL = user.bannerURL({ size: 4096 }) as string;
            if (user.avatarDecorationURL({ size: 4096 })) data.avatarDecorationURL = user.avatarDecorationURL({ size: 4096 }) as string;
        } catch (error) {
            log.error(`Error fetching user flags or URLs: ${error}`);
        }
        
        return { status: 200, data };
    }
);

interface Response {
    status: number;
    data?: IUser;
    error?: string;
}
