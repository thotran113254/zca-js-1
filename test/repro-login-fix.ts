/**
 * Repro test for issue #321 + fork fix verification.
 * Loads serialized cookies/imei/UA dumped from Mooly DB and attempts loginCookie.
 *
 * Usage:
 *   bun run test/repro-login-fix.ts /tmp/zalo-creds-938709344.json
 */
import { Zalo } from "../src/index.js";
import fs from "node:fs";

const path = process.argv[2];
if (!path) {
    console.error("usage: bun run test/repro-login-fix.ts <creds.json>");
    process.exit(2);
}

const raw = JSON.parse(fs.readFileSync(path, "utf8")) as {
    imei: string;
    userAgent: string;
    cookie: unknown[];
};

console.log(
    `[repro] creds: imei.len=${raw.imei.length} ua.len=${raw.userAgent.length} cookies=${raw.cookie.length}`,
);

const zalo = new Zalo({ logging: true });

(async () => {
    const t0 = Date.now();
    try {
        const api = await zalo.login({
            imei: raw.imei,
            userAgent: raw.userAgent,
            // tough-cookie SerializedCookie shape — parseCookies inside zca-js handles both
            cookie: raw.cookie as never,
            language: "vi",
        });
        console.log(`[repro] LOGIN OK in ${Date.now() - t0}ms`);
        const ctx = (api as unknown as { ctx?: { uid?: string } }).ctx;
        if (ctx?.uid) console.log("[repro] uid =", ctx.uid);
        process.exit(0);
    } catch (err) {
        console.error(`[repro] LOGIN FAILED in ${Date.now() - t0}ms:`, err);
        process.exit(1);
    }
})();
