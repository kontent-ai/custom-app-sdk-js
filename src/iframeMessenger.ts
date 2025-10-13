import type { z } from "zod";
import { createUuid } from "./createUuid";
import type { ClientContextChangedV1Notification, Schema } from "./iframeSchema";
import type { AllClientNotifications, AllClientResponses } from "./utilityTypes";

let callbacks: Readonly<Record<string, (data: unknown) => void>> = {};
let notificationCallbacks: Readonly<Record<string, (data: unknown) => void>> = {};

export const sendMessage = <TMessageType extends keyof Schema["client"]>(
  message: Omit<Schema["client"][TMessageType]["request"], "requestId">,
): Promise<Schema["client"][TMessageType]["response"]> => {
  return new Promise((resolve, reject) => {
    try {
      const requestId = createUuid();
      callbacks = { ...callbacks, [requestId]: resolve } as typeof callbacks;
      window.parent.postMessage({ ...message, requestId }, "*");
    } catch (error) {
      reject(error);
    }
  });
};

export const addNotificationCallback = (
  subscriptionId: string,
  callback: (notification: z.infer<typeof ClientContextChangedV1Notification>) => void,
): void => {
  notificationCallbacks = {
    ...notificationCallbacks,
    [subscriptionId]: callback,
  } as typeof notificationCallbacks;
};

export const removeNotificationCallback = (subscriptionId: string): void => {
  notificationCallbacks = Object.fromEntries(
    Object.entries(notificationCallbacks).filter(([subId]) => subId !== subscriptionId),
  );
};

const processMessage = (event: MessageEvent<AllClientResponses | AllClientNotifications>): void => {
  const message = event.data;

  if ("subscriptionId" in message) {
    const notification = message as AllClientNotifications;
    notificationCallbacks[message.subscriptionId]?.(notification);
    return;
  }

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
