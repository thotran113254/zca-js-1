import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { apiFactory } from "../utils.js";
export const logoutFactory = apiFactory()((api, _ctx, utils) => {
    const logoutTokenURL = "https://id.zalo.me/jr/logout-token";
    const logoutURL = "https://id.zalo.me/account/logout";
    /**
     * Logout the current account, invalidating the session cookies and stopping the listener
     *
     * @throws {ZaloApiError}
     */
    return async function logout() {
        var _a, _b;
        const tokenResponse = await utils.request(logoutTokenURL, {
            method: "POST",
            body: new URLSearchParams({
                continue: "https://chat.zalo.me/",
            }),
        });
        if (!tokenResponse.ok)
            throw new ZaloApiError("Failed to get logout token: " + tokenResponse.statusText);
        const tokenData = await tokenResponse.json();
        const token = (_a = tokenData === null || tokenData === void 0 ? void 0 : tokenData.data) === null || _a === void 0 ? void 0 : _a.token;
        if ((tokenData === null || tokenData === void 0 ? void 0 : tokenData.error_code) !== 0 || !token)
            throw new ZaloApiError((_b = tokenData === null || tokenData === void 0 ? void 0 : tokenData.error_message) !== null && _b !== void 0 ? _b : "Failed to get logout token", tokenData === null || tokenData === void 0 ? void 0 : tokenData.error_code);
        const logoutResponse = await utils.request(logoutURL, {
            method: "POST",
            body: new URLSearchParams({
                token,
            }),
        });
        if (!logoutResponse.ok)
            throw new ZaloApiError("Failed to logout: " + logoutResponse.statusText);
        // The response is an HTML page that loads each `setsid` URL in an iframe to expire the session cookies on its domain
        const html = await logoutResponse.text();
        const setSidMatch = html.match(/listSetSidUrls\s*:\s*(\[[^\]]*\])/);
        if (!setSidMatch)
            throw new ZaloApiError("Failed to logout: setsid urls not found");
        const setSidURLs = JSON.parse(setSidMatch[1]);
        await Promise.all(setSidURLs.map((url) => utils.request(url, {
            method: "GET",
            headers: {
                Referer: "https://id.zalo.me/",
            },
        })));
        api.listener.stop();
        return {
            status: true,
        };
    };
});
