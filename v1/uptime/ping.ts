import { api } from "encore.dev/api";
import log from "encore.dev/log";
import { db } from "./uptime";
import { message } from "./message";
import { CronJob } from "encore.dev/cron";

interface Response {
    status?: number;
    up?: boolean;
    latency?: number;
}

export const ping = api(
    { expose: false, method: "GET", path: "/v1/uptime/ping/:id", auth: false },
    async ({ id }: { id: string }): Promise<Response> => {
        console.log("Pinging", id)

        let row = await db.queryRow`SELECT * FROM uptime WHERE id = ${id}`;

        if (!row || !row.url) {
            db.exec`DELETE FROM uptime WHERE id = ${id}`;
            return { status: 404, up: false, latency: 0 };
        }

        let url = "";

        if (!row.url.startsWith("http://") && !row.url.startsWith("https://")) {
            url = "https://" + row.url;
        }
        
        const start = Date.now();
        try {
            await fetch(url);
        } catch (error) {
            db.exec`UPDATE uptime SET live = FALSE, last_check = NOW(), response_time = 0 WHERE id = ${id}`;
            log.error(`Error fetching URL: ${error}`);
            return { status: 404, up: false, latency: 0 };
        }
        const end = Date.now();
        db.exec`UPDATE uptime SET live = TRUE, last_check = NOW(), response_time = ${end - start} WHERE id = ${id}`;

        message({ id });

        return { status: 200, up: true, latency: end - start };
    }
);

export const pingAll = api(
    { expose: false, method: "GET", path: "/v1/uptime/pingAll", auth: false },
    async (): Promise<void> => {
        let table = db.query`SELECT * FROM uptime`;
        let rows = [];

        for await (const row of table) {
            rows.push(row.id);
        }

        for (let row of rows) {
            await ping({ id: row });
        }
    }
);

const _ = new CronJob("check-uptime", {
    every: '1h',
    endpoint: pingAll,
})