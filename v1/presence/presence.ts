import { api } from "encore.dev/api";
import log from "encore.dev/log";
import { client } from "../../bot";
import {assetsURL} from "../../handlers/functions";

interface Response {
    status: number;
    data?: any;
}

export const get = api(
    { expose: true, method: "GET", path: "/v1/presence/:id" },
    async ({ id }: { id: string }): Promise<Response> => {
        log.info(`Getting user with id: ${id}`);
        let simplifiedPresence: any = {};

        try {
            // @ts-ignore
            const guild = await client.guilds.fetch(process.env.BASE_GUILD);
            const member = guild.members.cache.get(id);

            if (member && member.presence) {
                log.info(`Fetching presence for member with id: ${member.id}`);
                simplifiedPresence.status = member.presence.status;
                simplifiedPresence.activities = member.presence.activities.map((activity) => ({
                    name: activity.name,
                    type: activity.type,
                    url: activity.url,
                    state: activity.state,
                    details: activity.details,
                    assets: activity.assets,
                    timestamps: activity.timestamps,
                    party: activity.party,
                    applicationId: activity.applicationId,
                    syncId: activity.syncId,
                    flags: activity.flags,
                    emoji: activity.emoji,
                    createdTimestamp: activity.createdTimestamp,
                    buttons: activity.buttons,
                }));

                simplifiedPresence.activities.forEach((activity: any) => {
                  if (activity.name !== "Custom Status") {
                      let assets = { largeImageURL: "", smallImageURL: "" }
                      assets = assetsURL(activity, assets);

                      if (activity.assets) {
                          if (assets.largeImageURL.length > 0) {
                              activity.assets.largeImageURL = assets.largeImageURL;
                          }
                          if (assets.smallImageURL.length > 0) {
                              activity.assets.smallImageURL = assets.smallImageURL;
                          }
                      }
                  }
                })

                log.info(`Presence fetched and simplified for member with id: ${member.id}`);
            } else {
                log.warn(`Member ${id} not found in guild or has no presence.`);
            }
        } catch (error) {
            log.error(`Error fetching or processing presence data: ${error}`);
            return { status: 500, data: { error: "Internal Server Error" } };
        }

        return { status: 200, data: simplifiedPresence };
    }
);