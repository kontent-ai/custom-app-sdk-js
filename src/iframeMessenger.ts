import { createUuid } from "./createUuid";
import type { Schema } from "./iframeSchema";
import { ClientPageContextChangedV1Notification } from "./iframeSchema";
import type { AllClientNotifications, AllClientResponses } from "./utilityTypes";
import { z } from "zod";

let callbacks: Readonly<Record<string, (data: unknown) => void>> = {};
let notificationCallbacks: Readonly<Record<string, (data: unknown) => void>> = {};

export const sendMessage = <TMessageType extends keyof Schema["client"]>(
  message: Omit<Schema["client"][TMessageType]["request"], "requestId">,
  callback: (data: Schema["client"][TMessageType]["response"]) => void,
): void => {
  const requestId = createUuid();
  callbacks = { ...callbacks, [requestId]: callback } as typeof callbacks;
  window.parent.postMessage({ ...message, requestId }, "*");
};

export const addNotificationCallback = (
  subscriptionId: string,
  callback: (notification: z.infer<typeof ClientPageContextChangedV1Notification>) => void,
): void => {
  notificationCallbacks = { ...notificationCallbacks, [subscriptionId]: callback } as typeof notificationCallbacks;
};

export const removeNotificationCallback = (
  subscriptionId: string,
): void => {
  notificationCallbacks = Object.fromEntries(
    Object.entries(notificationCallbacks).filter(([subscriptionId]) => subscriptionId !== subscriptionId),
  );
};

const processMessage = (event: MessageEvent<AllClientResponses | AllClientNotifications>): void => {
  const message = event.data;
  
  // Check if it's a notification
  if ('subscriptionId' in message) {
    const notification = message as AllClientNotifications;
    notificationCallbacks[message.subscriptionId]?.(notification);
    return;
  }
  
  // Otherwise, it's a response
  const response = message as AllClientResponses;
  const callback = callbacks[response.requestId];
  callbacks = Object.fromEntries(
    Object.entries(callbacks).filter(([requestId]) => requestId !== response.requestId),
  );
  callback?.(response);
};

if (window.self === window.top) {
  throw new Error("Custom app is not hosted in an IFrame.");
}

window.addEventListener("message", processMessage, true);
