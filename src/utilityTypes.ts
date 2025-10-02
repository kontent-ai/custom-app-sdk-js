import type { Schema } from "./iframeSchema";

export type AllClientResponses = AllClientMessages["response"];
export type AllClientRequests = AllClientMessages["request"];

export type AllClientNotifications = ExtractNotification<AllClientMessages>;

type AllClientMessages = Schema["client"][keyof Schema["client"]];

type ExtractNotification<T extends AllClientMessages> = T extends { notification: infer N } ? N : never;