import { createUuid } from './createUuid';
import type { CustomAppMessage } from './iframeSchema';
import type { GetRequestModelFor, GetResponseModelFor } from './utilityTypes';

let callbacks: Readonly<Record<string, (data: CustomAppMessage[1]) => void>> = {};

export const startListening = () => {
  if (window.self === window.top) {
    throw new Error('Custom app is not hosted in an IFrame.');
  }

  window.addEventListener('message', processMessage, true);
};

export const sendMessage = <
  TType extends CustomAppMessage[0]['type'],
  TVersion extends CustomAppMessage[0]['version'],
>(
  message: Omit<GetRequestModelFor<TType, TVersion>, 'requestId'>,
  callback: (data: GetResponseModelFor<TType, TVersion>) => void,
): void => {
  const requestId = createUuid();
  callbacks = { ...callbacks, [requestId]: callback } as Readonly<
    Record<string, (data: CustomAppMessage[1]) => void>
  >;
  window.parent.postMessage({ ...message, requestId }, '*');
};

const processMessage = (event: MessageEvent<CustomAppMessage[1]>): void => {
  const message = event.data;
  const callback = callbacks[message.requestId];
  callbacks = Object.fromEntries(
    Object.entries(callbacks).filter(([requestId]) => requestId !== message.requestId),
  );
  callback?.(message);
};
