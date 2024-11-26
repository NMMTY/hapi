import { api, Query } from "encore.dev/api";
import log from "encore.dev/log";
import { client } from "../../bot";
import {Emoji, Guild, Sticker} from "../../interfaces/DiscordData";

interface Response {
    status: number;
    data?: Guild;
    error?: string;
}

export const get = api(
    { expose: true, method: "GET", path: "/v1/guild/:id" },
    async ({ id, query }: { id: string; query?: Query<string> }): Promise<Response> => {
        log.info(`Getting guild with id: ${id}`);

        try {
            if (!client || !client.guilds) {
                log.error("Client is not initialized properly.");
                return { status: 500, error: "Internal Server Error" };
            }

            // @ts-ignore
            const guild = await client.guilds.fetch(id, { force: true });

            if (!guild) {
                log.error(`Guild with id ${id} not found.`);
                return { status: 404, error: "Guild not found" };
            }

            let data = {} as Guild;

            let emojis: Emoji[] = [];

            guild.emojis.fetch().then((fetchedEmojis) => {
                fetchedEmojis.forEach((emoji) => {
                    emojis.push({
                        animated: emoji.animated,
                        available: emoji.available,
                        createdAt: emoji.createdAt.toISOString(),
                        createdTimestamp: emoji.createdTimestamp,
                        id: emoji.id,
                        identifier: emoji.identifier,
                        name: emoji.name,
                        url: emoji.url,
                    });
                });
            })

            let stickers: Sticker[] = [];

            guild.stickers.fetch().then((fetchedStickers) => {
                fetchedStickers.forEach((sticker) => {
                    stickers.push({
                        available: sticker.available,
                        createdAt: sticker.createdAt.toISOString(),
                        createdTimestamp: sticker.createdTimestamp,
                        description: sticker.description,
                        id: sticker.id,
                        name: sticker.name,
                        packId: sticker.packId,
                        tags: sticker.tags,
                        type: sticker.type,
                        url: sticker.url,
                    });
                });
            });

            Object.assign(data, {
                afkChannelId: guild.afkChannelId,
                afkTimeout: guild.afkTimeout,
                applicationId: guild.applicationId,
                approximateMemberCount: guild.approximateMemberCount,
                approximatePresenceCount: guild.approximatePresenceCount,
                available: guild.available,
                banner: guild.banner,
                bannerURL: guild.bannerURL({ size: 4096 }),
                createdAt: guild.createdAt,
                createdTimestamp: guild.createdTimestamp,
                defaultMessageNotifications: guild.defaultMessageNotifications,
                description: guild.description,
                discoverySplash: guild.discoverySplash,
                discoverySplashURL: guild.discoverySplashURL({ size: 4096 }),
                emojis: emojis,
                explicitContentFilter: guild.explicitContentFilter,
                features: guild.features,
                icon: guild.icon,
                iconURL: guild.iconURL({ size: 4096 }),
                id: guild.id,
                large: guild.large,
                maximumBitrate: guild.maximumBitrate,
                maximumMembers: guild.maximumMembers,
                maximumPresences: guild.maximumPresences,
                maxVideoChannelUsers: guild.maxVideoChannelUsers,
                maxStageVideoChannelUsers: guild.maxStageVideoChannelUsers,
                memberCount: guild.memberCount,
                mfaLevel: guild.mfaLevel,
                name: guild.name,
                nameAcronym: guild.nameAcronym,
                nsfwLevel: guild.nsfwLevel,
                ownerId: guild.ownerId,
                partnered: guild.partnered,
                preferredLocale: guild.preferredLocale,
                premiumSubscriptionCount: guild.premiumSubscriptionCount,
                premiumTier: guild.premiumTier,
                publicUpdatesChannelId: guild.publicUpdatesChannelId,
                rulesChannelId: guild.rulesChannelId,
                safetyAlertsChannelId: guild.safetyAlertsChannelId,
                stickers: stickers,
                systemChannelId: guild.systemChannelId,
                vanityURLCode: guild.vanityURLCode,
                verificationLevel: guild.verificationLevel,
                widgetChannelId: guild.widgetChannelId,
                verified: guild.verified,
            });

            // Возвращаем успешный ответ
            return { status: 200, data };
        } catch (error: any) {
            // Логируем ошибку и возвращаем корректный статус
            log.error(`Failed to fetch guild with id ${id}: ${error.message}`);
            return { status: 500, error: "Failed to fetch guild data" };
        }
    }
);
