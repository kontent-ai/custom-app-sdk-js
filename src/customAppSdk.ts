import { sendMessage } from "./iframeMessenger";
import { ErrorMessage } from "./iframeSchema";
import { matchesSchema } from "./matchesSchema";

export enum ErrorCode {
  UnknownMessage = "unknown-message",
}

export type CustomAppContext =
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

export const getCustomAppContext = (): Promise<CustomAppContext> =>
  new Promise((resolve, reject) => {
    try {
      sendMessage<"get-context@1.0.0">(
        {
          type: "get-context-request",
          version: "1.0.0",
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
      reject(error);
    }
  });

export type PageContext =
  | {
      readonly isError: false;
      readonly pageContext:
        | (
            | {
                readonly path: string;
                readonly pageTitle: string;
                readonly pageType: "item-editor";
                readonly contentItem: {
                  readonly id: string;
                  readonly codename: string;
                  readonly language: {
                    readonly id: string;
                    readonly codename: string;
                  };
                };
                readonly validationErrors: Readonly<Record<string, ReadonlyArray<string>>>;
              }
            | {
                readonly path: string;
                readonly pageTitle: string;
                readonly pageType: "other";
              }
          )
        | null;
    }
  | {
      readonly isError: true;
      readonly code: ErrorCode;
      readonly description: string;
    };

export const getPageContext = (): Promise<PageContext> =>
  new Promise((resolve, reject) => {
    try {
      sendMessage<"get-page-context@1.0.0">(
        {
          type: "get-page-context-request",
          version: "1.0.0",
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
      reject(error);
    }
  });

export type SetPopupSizeResult =
  | {
      readonly isError: false;
      readonly success: boolean;
    }
  | {
      readonly isError: true;
      readonly code: ErrorCode;
      readonly description: string;
    };

export type PopupSizeDimension =
  | {
      readonly unit: "px";
      readonly value: number;
    }
  | {
      readonly unit: "%";
      readonly value: number;
    };

export const setPopupSize = (
  width: PopupSizeDimension,
  height: PopupSizeDimension,
): Promise<SetPopupSizeResult> =>
  new Promise((resolve, reject) => {
    try {
      sendMessage<"set-popup-size@1.0.0">(
        {
          type: "set-popup-size-request",
          version: "1.0.0",
          payload: {
            width,
            height,
          },
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
      reject(error);
    }
  });
