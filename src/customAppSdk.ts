import type { z } from "zod";
import {
  addNotificationCallback,
  removeNotificationCallback,
  sendMessage,
} from "./iframeMessenger";
import type { Schema } from "./iframeSchema";
import {
  type ClientPageContextChangedV1Notification,
  type CustomAppPageContextProperties,
  ErrorMessage,
} from "./iframeSchema";
import { matchesSchema } from "./matchesSchema";
import {
  isItemEditorPageContext,
  isOtherPageContext,
  itemEditorPageProperties,
  otherPageProperties,
  type PageContext,
} from "./pageContexts";

export enum ErrorCode {
  UnknownMessage = "unknown-message",
  OutdatedPageContext = "outdated-page-context",
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

export const getCustomAppContext = async (): Promise<CustomAppContext> => {
  const response = await sendMessagePromise<"get-context@1.0.0">({
    type: "get-context-request",
    version: "1.0.0",
    payload: null,
  });

  if (matchesSchema(ErrorMessage, response)) {
    return { isError: true, code: response.code, description: response.description };
  }

  return { ...response.payload, isError: false };
};

export type PageContextResult<T extends ReadonlyArray<keyof CustomAppPageContextProperties>> =
  | {
      readonly isError: false;
      readonly properties: { [K in T[number]]: CustomAppPageContextProperties[K] };
    }
  | {
      readonly isError: true;
      readonly code: ErrorCode;
      readonly description: string;
    };

export const getPageContext = async (): Promise<
  | { readonly isError: false; readonly context: PageContext }
  | { readonly isError: true; readonly code: ErrorCode; readonly description: string }
> => {
  // First, get current page to determine which properties to fetch
  const currentPageResponse = await sendMessagePromise<"get-page-context@1.0.0">({
    type: "get-page-context-request",
    version: "1.0.0",
    payload: {
      properties: ["currentPage"],
    },
  });

  if (matchesSchema(ErrorMessage, currentPageResponse)) {
    return {
      isError: true,
      code: currentPageResponse.code,
      description: currentPageResponse.description,
    };
  }

  const currentPage = currentPageResponse.payload.properties.currentPage;
  const propertiesToFetch =
    currentPage === "itemEditor" ? itemEditorPageProperties : otherPageProperties;

  // Fetch all properties for the specific page type
  const response = await sendMessagePromise<"get-page-context@1.0.0">({
    type: "get-page-context-request",
    version: "1.0.0",
    payload: {
      properties: propertiesToFetch,
    },
  });

  if (matchesSchema(ErrorMessage, response)) {
    return { isError: true, code: response.code, description: response.description };
  }

  return getPageContextFromProperties(response.payload.properties);
};

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

export const setPopupSize = async (
  width: PopupSizeDimension,
  height: PopupSizeDimension,
): Promise<SetPopupSizeResult> => {
  const response = await sendMessagePromise<"set-popup-size@1.0.0">({
    type: "set-popup-size-request",
    version: "1.0.0",
    payload: {
      width,
      height,
    },
  });

  if (matchesSchema(ErrorMessage, response)) {
    return { isError: true, code: response.code, description: response.description };
  }

  return { isError: false, success: response.payload.success };
};

const sendMessagePromise = <TMessageType extends keyof Schema["client"]>(
  message: Omit<Schema["client"][TMessageType]["request"], "requestId">,
): Promise<Schema["client"][TMessageType]["response"]> =>
  new Promise((resolve, reject) => {
    try {
      sendMessage<TMessageType>(message, resolve);
    } catch (error) {
      reject(error);
    }
  });

const outdatedPageContextError = {
  isError: true,
  code: ErrorCode.OutdatedPageContext,
  description:
    "The page context we received is outdated, please try to get the page context again.",
} as const;

export type ObservePageContextCallback = (context: PageContext) => void;

export type ObservePageContextResult =
  | {
      readonly isError: false;
      readonly context: PageContext;
      readonly unsubscribe: () => Promise<void>;
    }
  | {
      readonly isError: true;
      readonly code: ErrorCode;
      readonly description: string;
    };

export const observePageContext = async (
  callback: ObservePageContextCallback,
): Promise<ObservePageContextResult> => {
  // First, get current page to determine which properties to observe
  const currentPageResponse = await sendMessagePromise<"get-page-context@1.0.0">({
    type: "get-page-context-request",
    version: "1.0.0",
    payload: {
      properties: ["currentPage"],
    },
  });

  if (matchesSchema(ErrorMessage, currentPageResponse)) {
    return {
      isError: true,
      code: currentPageResponse.code,
      description: currentPageResponse.description,
    };
  }

  const currentPage = currentPageResponse.payload.properties.currentPage;
  const propertiesToObserve =
    currentPage === "itemEditor" ? itemEditorPageProperties : otherPageProperties;

  // Start observing with the appropriate properties
  const observeResponse = await sendMessagePromise<"observe-page-context@1.0.0">({
    type: "observe-page-context-request",
    version: "1.0.0",
    payload: {
      properties: propertiesToObserve,
    },
  });

  if (matchesSchema(ErrorMessage, observeResponse)) {
    return { isError: true, code: observeResponse.code, description: observeResponse.description };
  }

  // Process the initial context
  const initialContext = getPageContextFromProperties(observeResponse.payload.properties);
  if (initialContext.isError) {
    return initialContext;
  }

  // Set up notification handler
  const notificationHandler = (
    notification: z.infer<typeof ClientPageContextChangedV1Notification>,
  ) => {
    const contextResult = getPageContextFromProperties(notification.payload.properties);
    if (!contextResult.isError) {
      callback(contextResult.context);
    }
  };

  addNotificationCallback(observeResponse.payload.subscriptionId, notificationHandler);

  // Create unsubscribe function
  const unsubscribe = async (): Promise<void> => {
    removeNotificationCallback(observeResponse.payload.subscriptionId);

    await sendMessagePromise<"unsubscribe-page-context@1.0.0">({
      type: "unsubscribe-page-context-request",
      version: "1.0.0",
      payload: {
        subscriptionId: observeResponse.payload.subscriptionId,
      },
    });
  };

  return {
    isError: false,
    context: initialContext.context,
    unsubscribe,
  };
};

const getPageContextFromProperties = (
  properties: CustomAppPageContextProperties,
):
  | { isError: false; context: PageContext }
  | { isError: true; code: ErrorCode; description: string } => {
  const currentPage = properties.currentPage;

  switch (currentPage) {
    case "itemEditor":
      return isItemEditorPageContext(properties)
        ? { isError: false, context: properties }
        : outdatedPageContextError;
    case "other":
      return isOtherPageContext(properties)
        ? { isError: false, context: properties }
        : outdatedPageContextError;
    default:
      return outdatedPageContextError;
  }
};
