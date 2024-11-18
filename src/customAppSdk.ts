import { sendMessage, startListening } from './iframeMessenger';
import { ErrorMessage } from './iframeSchema';
import { matchesSchema } from './matchesSchema';

export enum ErrorCode {
  Nnn = 'Nnn',
}

export type InitReturn =
  | {
    readonly isError: false;
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
  }
  | {
  readonly isError: true;
  readonly code: ErrorCode;
  readonly description: string;
};

export const initCustomApp = (): Promise<InitReturn> => {
  const stopListening = startListening();

  return new Promise((resolve, reject) => {
    try {
      sendMessage<'init@1.0.0'>(
        {
          type: 'init-request',
          version: '1.0.0',
          payload: null,
        },
        (response) => {
          if (matchesSchema(ErrorMessage, response)) {
            resolve({ isError: true, code: response.code, description: response.description });
          } else {
            resolve({ ...response.payload, isError: false });
          }
        },
      );
    } catch (error) {
      stopListening();
      reject(error);
    }
  });
};
