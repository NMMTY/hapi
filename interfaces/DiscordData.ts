import { ActivityFlagsBitField, Emoji, RichPresenceAssets, UserFlagsBitField } from "discord.js";

export interface User {
    id: string;
    bot: boolean;
    system: boolean;
    flags: Readonly<UserFlagsBitField> | null;
    username: string;
    globalName: string | null;
    discriminator: string;
    avatar: string | null;
    banner: string | null | undefined;
    accentColor: number | null | undefined;
    avatarDecoration: string | null;
    badges: string[];
    avatarDecorationURL: string;
    avatarURL: string;
    bannerURL: string;
}

export interface Presence {
    status: string | null;
    activities: Activity[];
}

export interface Activity {
    name: string;
    type: number;
    url: string | null;
    details: string | null;
    state: string | null;
    applicationId: string | null;
    timestamps: {
        start: Date | null;
        end: Date | null;
    } | null;
    party: {
        id: string | null;
        size: [number, number];
    } | null;
    assets: RichPresenceAssets | null;
    flags: Readonly<ActivityFlagsBitField> | null;
    emoji: Emoji | null;
    buttons: string[];
}