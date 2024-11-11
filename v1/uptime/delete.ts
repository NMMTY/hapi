import { api } from "encore.dev/api";
import { db } from "./uptime";
import log from "encore.dev/log";

interface Response {
    status: number;
    deleted: boolean;
}

export const deleteCheck = api(
    { expose: true, method: "DELETE", path: "/v1/uptime/delete/:id", auth: true },
    async ({ id }: { id: string }): Promise<Response> => {
        db.exec`DELETE FROM uptime WHERE id = ${id}`;
        db.exec`DELETE FROM pass WHERE id = ${id}`;
        return { status: 200, deleted: true };
    }
);