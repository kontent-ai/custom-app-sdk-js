import { createUuid } from "./createUuid";
import type { Schema } from "./iframeSchema";
import type { AllClientResponses } from "./utilityTypes";

let callbacks: Readonly<Record<string, (data: unknown) => void>> = {};

export const sendMessage = <TMessageType extends keyof Schema["client"]>(
  message: Omit<Schema["client"][TMessageType]["request"], "requestId">,
  callback: (data: Schema["client"][TMessageType]["response"]) => void,
): void => {
  const requestId = createUuid();
  callbacks = { ...callbacks, [requestId]: callback } as typeof callbacks;
  window.parent.postMessage({ ...message, requestId }, "*");
};

const processMessage = (event: MessageEvent<AllClientResponses>): void => {
  const message = event.data;
  const callback = callbacks[message.requestId];
  callbacks = Object.fromEntries(
    Object.entries(callbacks).filter(([requestId]) => requestId !== message.requestId),
  );
  callback?.(message);
};

if (window.self === window.top) {
  throw new Error("Custom app is not hosted in an IFrame.");
}

window.addEventListener("message", processMessage, true);
