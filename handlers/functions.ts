import {Activity, Client, UserFlagsString} from "discord.js";
import { Documentation } from "@hitomihiumi/micro-docgen";

function isUrl(url: string) {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g.test(url);
}

function assetsURL(activity: Activity, data: { largeImageURL: string, smallImageURL: string }) {
    try {
        if (activity.assets) {
            if (activity.assets.largeImage && !isUrl(activity.assets.largeImage))
                data.largeImageURL = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.largeImage}.png`;
            if (activity.assets.smallImage && !isUrl(activity.assets.smallImage))
                data.smallImageURL = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.smallImage}.png`;
        }
    } catch (error) {
        console.error("Error in assetsURL:", error);
    }
    return data;
}

function getFlags(flags: UserFlagsString[]) {
    let badges: string[] = [];

    flags.forEach((flag) => {
        switch (flag) {
            case "Staff":
                badges.push("Discord Employee");
                break;
            case "Partner":
                badges.push("Partnered Server Owner");
                break;
            case "BugHunterLevel1":
                badges.push("Bug Hunter Level 1");
                break;
            case "BugHunterLevel2":
                badges.push("Bug Hunter Level 2");
                break;
            case "HypeSquadOnlineHouse1":
                badges.push("House of Bravery");
                break;
            case "HypeSquadOnlineHouse2":
                badges.push("House of Brilliance");
                break;
            case "HypeSquadOnlineHouse3":
                badges.push("House of Balance");
                break;
            case "PremiumEarlySupporter":
                badges.push("Early Supporter");
                break;
            case "VerifiedDeveloper":
                badges.push("Verified Developer");
                break;
            case "ActiveDeveloper":
                badges.push("Active Developer");
                break;
            case "CertifiedModerator":
                badges.push("Certified Moderator");
                break;
            case "VerifiedBot":
                badges.push("Verified Bot");
                break;
        }
    });

    return badges;
}

function getSize(size: number) {
    const validSizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
    return validSizes.includes(size) ? size : 4096;
}

async function getGuildData(client: Client, user: any, data: any, log: any) {
    try {


        log.info(`User and guild data fetched successfully.`);
        return { status: 200, data };
    } catch (e: any) {
        log.error(`Error fetching guild or presence data: ${e.message}`);
        return { status: 500, data: { error: "Internal Server Error" } };
    }
}

function sortPackages(docs: Array<Documentation>): Array<Documentation> {
    return docs.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);
}

export { assetsURL, getFlags, getSize, sortPackages, getGuildData };