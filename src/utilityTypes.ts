import type { Schema } from "./iframeSchema";

export type AllClientResponses = Schema["client"][keyof Schema["client"]]["response"];
export type AllClientRequests = Schema["client"][keyof Schema["client"]]["request"];
