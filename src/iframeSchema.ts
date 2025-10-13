import { z } from "zod";

export enum ErrorCode {
  UnknownMessage = "unknown-message",
  NotSupported = "not-supported",
}

export const ErrorMessage = z
  .object({
    requestId: z.uuid(),
    isError: z.literal(true),
    code: z.nativeEnum(ErrorCode),
    description: z.string(),
  })
  .readonly();

const ClientGetContextV1Request = z
  .object({
    type: z.literal("get-context-request"),
    requestId: z.uuid(),
    version: z.literal("1.0.0"),
    payload: z.null(),
  })
  .readonly();

const CustomAppContextV1Schema = z
  .object({
    context: z
      .object({
        environmentId: z.string().uuid(),
        userId: z.string(),
        userEmail: z.string().email(),
        userRoles: z
          .array(
            z
              .object({
                id: z.string().uuid(),
                codename: z.string().or(z.null()),
              })
              .readonly(),
          )
          .readonly(),
      })
      .readonly(),
    config: z.unknown(),
  })
  .readonly();

export type CustomAppContextV1 = z.infer<typeof CustomAppContextV1Schema>;

const ClientGetContextV1Response = z
  .object({
    type: z.literal("get-context-response"),
    isError: z.literal(false),
    payload: CustomAppContextV1Schema.readonly(),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

export type CustomAppContextProperties = {
  readonly environmentId?: string;
  readonly userId?: string;
  readonly userEmail?: string;
  readonly userRoles?: ReadonlyArray<{
    readonly id: string;
    readonly codename: string | null;
  }>;
  readonly appConfig?: unknown;
  readonly contentItemId?: string;
  readonly languageId?: string;
  readonly path?: string;
  readonly pageTitle?: string;
  readonly validationErrors?: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly currentPage?: "itemEditor" | "other";
};

export const allCustomAppContextPropertyKeys = Object.keys({
  environmentId: "",
  userId: "",
  userEmail: "",
  userRoles: "",
  appConfig: "",
  contentItemId: "",
  languageId: "",
  path: "",
  pageTitle: "",
  validationErrors: "",
  currentPage: "",
} as const satisfies Record<keyof CustomAppContextProperties, string>);

const ClientGetContextV2Request = z
  .object({
    type: z.literal("get-context-request"),
    requestId: z.string().uuid(),
    version: z.literal("2.0.0"),
    payload: z
      .object({
        properties: z.array(z.enum(allCustomAppContextPropertyKeys)).readonly(),
      })
      .readonly(),
  })
  .readonly();

const CustomAppContextPropertiesSchema = z
  .object({
    environmentId: z.string().uuid().optional(),
    userId: z.string().optional(),
    userEmail: z.string().email().optional(),
    userRoles: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            codename: z.string().or(z.null()),
          })
          .readonly(),
      )
      .readonly()
      .optional(),
    appConfig: z.unknown().optional(),
    contentItemId: z.string().uuid().optional(),
    languageId: z.string().uuid().optional(),
    path: z.string().optional(),
    pageTitle: z.string().optional(),
    validationErrors: z.record(z.string(), z.array(z.string()).readonly()).readonly().optional(),
    currentPage: z.union([z.literal("itemEditor"), z.literal("other")]).optional(),
  } as const satisfies Required<{
    readonly [K in keyof CustomAppContextProperties]: z.ZodType<
      Partial<CustomAppContextProperties>[K]
    >;
  }>)
  .readonly();

export type CustomAppContext = z.infer<typeof CustomAppContextPropertiesSchema>;

const ClientGetContextV2Response = z
  .object({
    type: z.literal("get-context-response"),
    isError: z.literal(false),
    payload: z
      .object({
        properties: CustomAppContextPropertiesSchema.readonly(),
      })
      .readonly(),
    requestId: z.string().uuid(),
    version: z.literal("2.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

const PopupSizeDimensionSchema = z
  .union([
    z.object({
      unit: z.literal("px"),
      value: z.number().min(200).max(2000),
    }),
    z.object({
      unit: z.literal("%"),
      value: z.number().min(10).max(100),
    }),
  ])
  .readonly();

export const ClientSetPopupSizeV1Request = z
  .object({
    type: z.literal("set-popup-size-request"),
    requestId: z.uuid(),
    version: z.literal("1.0.0"),
    payload: z
      .object({
        width: PopupSizeDimensionSchema,
        height: PopupSizeDimensionSchema,
      })
      .readonly(),
  })
  .readonly();

export const ClientSetPopupSizeV1Response = z
  .object({
    type: z.literal("set-popup-size-response"),
    isError: z.literal(false),
    requestId: z.uuid(),
    version: z.literal("1.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

export const ClientObserveContextV1Request = z
  .object({
    type: z.literal("observe-context-request"),
    requestId: z.uuid(),
    version: z.literal("1.0.0"),
    payload: z
      .object({
        properties: z.array(z.enum(allCustomAppContextPropertyKeys)).readonly(),
      })
      .readonly(),
  })
  .readonly();

export const ClientObserveContextV1Response = z
  .object({
    type: z.literal("observe-context-response"),
    isError: z.literal(false),
    payload: z
      .object({
        subscriptionId: z.string().uuid(),
      })
      .readonly(),
    requestId: z.uuid(),
    version: z.literal("1.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

export const ClientUnsubscribeContextV1Request = z
  .object({
    type: z.literal("unsubscribe-context-request"),
    requestId: z.uuid(),
    version: z.literal("1.0.0"),
    payload: z
      .object({
        subscriptionId: z.uuid(),
      })
      .readonly(),
  })
  .readonly();

export const ClientUnsubscribeContextV1Response = z
  .object({
    type: z.literal("unsubscribe-context-response"),
    isError: z.literal(false),
    payload: z
      .object({
        success: z.boolean(),
      })
      .readonly(),
    requestId: z.uuid(),
    version: z.literal("1.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

export const ClientContextChangedV1Notification = z
  .object({
    type: z.literal("context-changed-notification"),
    subscriptionId: z.uuid(),
    version: z.literal("1.0.0"),
    payload: z
      .object({
        properties: CustomAppContextPropertiesSchema.readonly(),
      })
      .readonly(),
  })
  .readonly();

export const AllClientRequestMessages = z.union([
  ClientGetContextV1Request,
  ClientGetContextV2Request,
  ClientSetPopupSizeV1Request,
  ClientObserveContextV1Request,
  ClientUnsubscribeContextV1Request,
]);

export type Schema = {
  client: {
    "get-context@1.0.0": {
      request: z.infer<typeof ClientGetContextV1Request>;
      response: z.infer<typeof ClientGetContextV1Response>;
    };
    "get-context@2.0.0": {
      request: z.infer<typeof ClientGetContextV2Request>;
      response: z.infer<typeof ClientGetContextV2Response>;
    };
    "set-popup-size@1.0.0": {
      request: z.infer<typeof ClientSetPopupSizeV1Request>;
      response: z.infer<typeof ClientSetPopupSizeV1Response>;
    };
    "set-popup-size@1.2.0": {
      request: z.infer<typeof ClientSetPopupSizeV1Request>;
      response: z.infer<typeof ClientSetPopupSizeV1Response>;
    };
    "observe-context@1.0.0": {
      request: z.infer<typeof ClientObserveContextV1Request>;
      response: z.infer<typeof ClientObserveContextV1Response>;
      notification: z.infer<typeof ClientContextChangedV1Notification>;
    };
    "unsubscribe-context@1.0.0": {
      request: z.infer<typeof ClientUnsubscribeContextV1Request>;
      response: z.infer<typeof ClientUnsubscribeContextV1Response>;
    };
  };
};
