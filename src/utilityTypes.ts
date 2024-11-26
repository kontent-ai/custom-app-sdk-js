import type { Schema } from './iframeSchema';

export type AllClientResponses = Schema['client'][keyof Schema['client']]['response'];

export type AllHostRequests = Schema['host'][keyof Schema['host']]['request'];

export type AllIncomingMessages = AllClientResponses | AllHostRequests;
