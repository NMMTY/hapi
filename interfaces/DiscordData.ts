export interface User {
    id: string;
    bot: boolean;
    system: boolean;
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
        start: string | null;
        end: string | null;
    } | null;
    party: {
        id: string | null;
        size: number[];
    } | null;
    assets: {
        largeImageURL: string | null;
        smallImageURL: string | null;
        largeImage: string | null;
        smallImage: string | null;
        largeText: string | null;
        smallText: string | null;
    } | null;
    emoji: Emoji | null;
    buttons: string[];
}

export interface Guild {
    afkChannelId: string | null;
    afkTimeout: number;
    applicationId: string | null;
    approximateMemberCount: number;
    approximatePresenceCount: number;
    available: boolean;
    banner: string | null;
    bannerURL: string | null;
    createdAt: string;
    createdTimestamp: number;
    defaultMessageNotifications: number;
    description: string | null;
    discoverySplash: string | null;
    discoverySplashURL: string | null;
    emojis: Emoji[];
    explicitContentFilter: number;
    features: string[];
    icon: string | null;
    iconURL: string | null;
    id: string;
    large: boolean;
    maximumBitrate: number;
    maximumMembers: number;
    maximumPresences: number;
    maxVideoChannelUsers: number;
    maxStageVideoChannelUsers: number;
    memberCount: number;
    mfaLevel: number;
    name: string;
    nameAcronym: string;
    nsfwLevel: number;
    ownerId: string;
    partnered: boolean;
    preferredLocale: string;
    premiumSubscriptionCount: number;
    premiumTier: number;
    publicUpdatesChannelId: string | null;
    rulesChannelId: string | null;
    safetyAlertsChannelId: string | null;
    stickers: Sticker[];
    systemChannelId: string | null;
    vanityURLCode: string | null;
    verificationLevel: number;
    widgetChannelId: string | null;
    verified: boolean;
}

export interface Emoji {
    animated: boolean | null;
    available: boolean | null;
    createdAt: string;
    createdTimestamp: number;
    id: string | null;
    identifier: string | null;
    name: string | null;
    url: string | null;
}

export interface Sticker {
    available: boolean | null;
    createdAt: string;
    createdTimestamp: number;
    description: string | null;
    id: string;
    name: string;
    packId: string | null;
    tags: string | null;
    type: number | null;
    url: string;
}