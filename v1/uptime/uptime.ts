import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import log from "encore.dev/log";
import { client } from "../../bot";
import {randomBytes} from "node:crypto";
import { EmbedBuilder } from "discord.js";

export const db = new SQLDatabase("uptime", { migrations: "./migrations" });

interface Response {
    status: number;
    id?: string;
    message?: string;
}

export const set = api(
    { expose: true, method: "POST", path: "/v1/uptime", auth: false },
    async ({ url, webhook, userID }: { url: string, webhook: string, userID: string }): Promise<Response> => {
        let user = await client.users.fetch(userID);
        if (!user) {
            return { status: 404, message: "User not found, please join to the server" };
        }

        const pass = randomBytes(64).toString("base64url");
        const id = randomBytes(16).toString("base64url");

        user.send({ embeds: [
            new EmbedBuilder()
                .setTitle("Pass Key")
                .setDescription(`Here is your pass key and ID, please keep it safe and do not share it with anyone.`)
                .addFields(
                    { name: "Pass Key", value: `||\`${pass}\`||` },
                    { name: "ID", value: `||\`${id}\`||` },
                    { name: "Site", value: `||${!url.startsWith('https://') && !url.startsWith('http://') ? 'https://' + `${url}` : url }||` },
                    { name: "Webhook", value: `||${!webhook.startsWith('https://') && !webhook.startsWith('http://') ? 'https://' + `${webhook}` : webhook }||` }
                )
                .setColor(0x00FF00)
                .setTimestamp(new Date())
            ] })

        await db.exec`
            INSERT INTO pass (id, pass) VALUES (${id}, ${pass})
        `;

        await db.exec`
            INSERT INTO uptime (id, url, webhook, response_time, created_at, last_check, live)
            VALUES (${id}, ${url}, ${webhook}, 0, NOW(), NOW(), FALSE)
        `;
        return { status: 200, id };
    }
);