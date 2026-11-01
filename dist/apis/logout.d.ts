export type LogoutResponse = {
    status: boolean;
};
export declare const logoutFactory: (ctx: import("../context.js").ContextBase, api: import("../apis.js").API) => () => Promise<{
    status: boolean;
}>;
