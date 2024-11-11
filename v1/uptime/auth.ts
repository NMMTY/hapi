import { Header, Gateway, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { db } from "./uptime";
import log from "encore.dev/log";

interface AuthParams {
    authorization: Header<"Authorization">;
}

interface AuthData {
    userID: string;
}

export const auth = authHandler(
    async (params: AuthParams): Promise<AuthData> => {
        const token = params.authorization;

        if (!token) {
            throw APIError.unauthenticated("no token provided");
        }

        try {
            let result = db.query`SELECT * FROM pass WHERE pass = ${token}`;

            let results = [];

            for await (const row of result) {
                results.push(row);
            }

            if (results.length === 0) {
                throw APIError.unauthenticated("invalid token");
            }

            let query = await  db.queryRow`SELECT * FROM uptime WHERE id = ${results[0].id}`;

            if (!query || !query.url) {
                db.exec`DELETE FROM pass WHERE pass = ${token}`;
                db.exec`DELETE FROM uptime WHERE id = ${results[0].id}`;
                throw APIError.unauthenticated("invalid token");
            }

            return { userID: results[0].id };

        } catch (error) {
            log.error(error);
            throw APIError.unauthenticated("invalid token", error as Error);
        }
    }
)

export const gateway = new Gateway({
    authHandler: auth,
})