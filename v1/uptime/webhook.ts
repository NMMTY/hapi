import { api } from "encore.dev/api";
import { db } from "./uptime";
import log from "encore.dev/log";

export const webhookChange = api(
    { expose: true, method: "POST", path: "/v1/uptime/webhook", auth: true },
    async ({ id, url }: { id: string, url: string }): Promise<void> => {
        db.exec`UPDATE uptime SET webhook = ${url} WHERE id = ${id}`;
    }
);