import { api } from "encore.dev/api";
import log from "encore.dev/log";
import { client } from "../../bot";
import { db } from "./uptime";
import { WebhookClient, EmbedBuilder } from "discord.js";

interface Response {
    status: number;
    data?: any;
}

export const message = api(
    { expose: false, method: "GET", path: "/v1/uptime/message/:id" },
    async ({ id }: { id: string }): Promise<Response> => {
        let row = await db.queryRow`SELECT * FROM uptime WHERE id = ${id}`;

        log.info("Message", row)

        if (!row || !row.webhook) {
            db.exec`DELETE FROM uptime WHERE id = ${id}`;
            return { status: 404 };
        }

        let url = "";
        let site = "";

        if (!row.webhook.startsWith("http:") && !row.webhook.startsWith("https:")) {
            url = "https://" + row.webhook;
        }

        if (!row.url.startsWith("http:") && !row.url.startsWith("https:")) {
            site = "https://" + row.url;
        }

        const webhook = new WebhookClient({ url });
        const embed = new EmbedBuilder()
            .setTitle("Uptime Notification")
            .setDescription(`Your [website](${site}) is currently ${row.live ? "online" : "offline"}`)
            .addFields( { name: "Link", value: `${site}` },
                { name: "Response Time", value: `${row.response_time}ms` },
                { name: "Last Check", value: `${row.last_check}` })
            .setColor(row.live ? 0x00FF00 : 0xFF0000)
            .setTimestamp(new Date());

        await webhook.send({ embeds: [embed] });

        return { status: 200, data: { live: row.live } };
    }
)