import type { z } from "zod";
import {
  type Context,
  isItemEditorContext,
  isOtherContext,
  itemEditorContextProperties,
  otherContextProperties,
} from "./contexts";
import {
  addNotificationCallback,
  removeNotificationCallback,
  sendMessage,
} from "./iframeMessenger";
import {
  type ClientContextChangedV1Notification,
  type CustomAppContextProperties,
  ErrorMessage,
} from "./iframeSchema";
import { matchesSchema } from "./matchesSchema";

export enum ErrorCode {
  UnknownMessage = "unknown-message",
  NotSupported = "not-supported",
  OutdatedContext = "outdated-context",
}

export const getCustomAppContext = async (): Promise<Result<{ readonly context: Context }>> => {
  const currentPageResponse = await sendMessage<"get-context@2.0.0">({
    type: "get-context-request",
    version: "2.0.0",
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
    currentPage === "itemEditor" ? itemEditorContextProperties : otherContextProperties;

  const response = await sendMessage<"get-context@2.0.0">({
    type: "get-context-request",
    version: "2.0.0",
    payload: {
      properties: propertiesToFetch,
    },
  });

  if (matchesSchema(ErrorMessage, response)) {
    return { isError: true, code: response.code, description: response.description };
  }

  return getContextFromProperties(response.payload.properties);
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
): Promise<Result<{ readonly isError: false }>> => {
  const response = await sendMessage<"set-popup-size@1.0.0">({
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

  return { isError: false };
};

const outdatedContextError = {
  isError: true,
  code: ErrorCode.OutdatedContext,
  description: "The context we received is outdated, please try to get the context again.",
} as const;

export const observeCustomAppContext = async (
  callback: (context: Context) => void,
): Promise<Result<{ readonly context: Context; readonly unsubscribe: () => Promise<void> }>> => {
  const currentPageResponse = await sendMessage<"get-context@2.0.0">({
    type: "get-context-request",
    version: "2.0.0",
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
    currentPage === "itemEditor" ? itemEditorContextProperties : otherContextProperties;

  const observeResponse = await sendMessage<"observe-context@1.0.0">({
    type: "observe-context-request",
    version: "1.0.0",
    payload: {
      properties: propertiesToObserve,
    },
  });

  if (matchesSchema(ErrorMessage, observeResponse)) {
    return { isError: true, code: observeResponse.code, description: observeResponse.description };
  }

  const initialContextResponse = await sendMessage<"get-context@2.0.0">({
    type: "get-context-request",
    version: "2.0.0",
    payload: {
      properties: propertiesToObserve,
    },
  });

  if (matchesSchema(ErrorMessage, initialContextResponse)) {
    return {
      isError: true,
      code: initialContextResponse.code,
      description: initialContextResponse.description,
    };
  }

  const initialContext = getContextFromProperties(initialContextResponse.payload.properties);
  if (initialContext.isError) {
    return initialContext;
  }

  const notificationHandler = (
    notification: z.infer<typeof ClientContextChangedV1Notification>,
  ) => {
    const contextResult = getContextFromProperties(notification.payload.properties);
    if (!contextResult.isError) {
      callback(contextResult.context);
    }
  };

  addNotificationCallback(observeResponse.payload.subscriptionId, notificationHandler);

  const unsubscribe = async (): Promise<void> => {
    removeNotificationCallback(observeResponse.payload.subscriptionId);

    await sendMessage<"unsubscribe-context@1.0.0">({
      type: "unsubscribe-context-request",
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

const getContextFromProperties = (
  properties: CustomAppContextProperties,
): Result<{ readonly context: Context }> => {
  const currentPage = properties.currentPage;

  switch (currentPage) {
    case "itemEditor":
      return isItemEditorContext(properties)
        ? { isError: false, context: properties }
        : outdatedContextError;
    case "other":
      return isOtherContext(properties)
        ? { isError: false, context: properties }
        : outdatedContextError;
    default:
      return outdatedContextError;
  }
};

type Result<T> = ({ isError: false } & T) | { isError: true; code: ErrorCode; description: string };
