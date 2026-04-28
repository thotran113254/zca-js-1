import type { ContextBase } from "../context.js";
export declare function login(ctx: ContextBase, encryptParams: boolean): Promise<Record<string, unknown> | null>;
export declare function getServerInfo(ctx: ContextBase, encryptParams: boolean): Promise<any>;
/**
 * Fetch the current Zalo Web API version (`zpw_ver`) by scraping the live JS bundle
 * served from chat.zalo.me. Zalo bumps this version periodically and rejects
 * requests carrying a stale `zpw_ver`, surfacing as "Đăng nhập thất bại" at loginCookie.
 *
 * Returns 670 if scraping fails.
 */
export declare function getApiVersion(ctx: ContextBase): Promise<number>;
