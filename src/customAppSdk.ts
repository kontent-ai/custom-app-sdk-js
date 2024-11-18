import { isType } from './isType';
import { sendMessage, startListening } from './iframeMessenger';
import { ErrorMessage } from './iframeSchema';

export enum ErrorCode {
  Nnn = 'Nnn',
}

export type InitReturn =
  | {
      readonly isError: false;
      readonly payload: {
        readonly context: {
          readonly environmentId: string;
          readonly userId: string;
          readonly userEmail: string;
          readonly userRoles: ReadonlyArray<{
            readonly id: string;
            readonly codename: string | null;
          }>;
        };
        readonly config?: unknown;
      };
    }
  | {
      readonly isError: true;
      readonly code: ErrorCode;
      readonly description: string;
    };

export const initCustomApp = (): Promise<InitReturn> => {
  startListening();

  return new Promise((resolve, reject) => {
    try {
      sendMessage<'init-request', '1.0.0'>(
        {
          type: 'init-request',
          version: '1.0.0',
          payload: null,
        },
        (response) => {
          if (isType(ErrorMessage, response)) {
            resolve({ isError: true, code: response.code, description: response.description });
          } else {
            resolve({ isError: false, payload: response.payload });
          }
        },
      );
    } catch (error) {
      reject(error);
    }
  });
};
