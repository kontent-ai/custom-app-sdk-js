import { z } from "zod";

enum ErrorCode {
  UnknownMessage = "unknown-message",
}

export const ErrorMessage = z
  .object({
    requestId: z.string().uuid(),
    isError: z.boolean(),
    code: z.nativeEnum(ErrorCode),
    description: z.string(),
  })
  .readonly();

const ClientGetContextV1Request = z
  .object({
    type: z.literal("get-context-request"),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
    payload: z.null(),
  })
  .readonly();

const ClientGetContextV1Response = z
  .object({
    type: z.literal("get-context-response"),
    isError: z.boolean(),
    payload: z
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
      .readonly(),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

const ClientGetCustomAppPageContextV1Request = z
  .object({
    type: z.literal("get-page-context-request"),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
    payload: z.null(),
  })
  .readonly();

const baseCustomAppPageContextProperties = {
  path: z.string(),
  pageTitle: z.string(),
};

const ItemEditorCustomAppPageContextSchema = z
  .object({
    ...baseCustomAppPageContextProperties,
    pageType: z.literal("item-editor"),
    contentItem: z
      .object({
        id: z.string().uuid(),
        codename: z.string(),
        language: z
          .object({
            id: z.string().uuid(),
            codename: z.string(),
          })
          .readonly(),
      })
      .readonly(),
    validationErrors: z.record(z.string(), z.array(z.string()).readonly()).readonly(),
  })
  .readonly();

const CustomAppOtherPageContextSchema = z
  .object({
    ...baseCustomAppPageContextProperties,
    pageType: z.literal("other"),
  })
  .readonly();

const CustomAppPageContextSchema = z.union([
  ItemEditorCustomAppPageContextSchema,
  CustomAppOtherPageContextSchema,
]);

const ClientGetCustomAppPageContextV1Response = z
  .object({
    type: z.literal("get-page-context-response"),
    isError: z.boolean(),
    payload: z
      .object({
        pageContext: CustomAppPageContextSchema.nullable(),
      })
      .readonly(),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

const ClientSetPopupSizeV1Request = z
  .object({
    type: z.literal("set-popup-size-request"),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
    payload: z
      .object({
        width: z.union([
          z
            .object({
              unit: z.literal("px"),
              value: z.number().min(200).max(2000),
            })
            .readonly(),
          z
            .object({
              unit: z.literal("%"),
              value: z.number().min(10).max(100),
            })
            .readonly(),
        ]),
        height: z.union([
          z
            .object({
              unit: z.literal("px"),
              value: z.number().min(150).max(1500),
            })
            .readonly(),
          z
            .object({
              unit: z.literal("%"),
              value: z.number().min(10).max(100),
            })
            .readonly(),
        ]),
      })
      .readonly(),
  })
  .readonly();

const ClientSetPopupSizeV1Response = z
  .object({
    type: z.literal("set-popup-size-response"),
    isError: z.boolean(),
    payload: z
      .object({
        success: z.boolean(),
      })
      .readonly(),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

export const AllClientRequestMessages = z.union([
  ClientGetContextV1Request,
  ClientGetCustomAppPageContextV1Request,
  ClientSetPopupSizeV1Request,
]);

export type Schema = {
  client: {
    "get-context@1.0.0": {
      request: z.infer<typeof ClientGetContextV1Request>;
      response: z.infer<typeof ClientGetContextV1Response>;
    };
    "get-page-context@1.0.0": {
      request: z.infer<typeof ClientGetCustomAppPageContextV1Request>;
      response: z.infer<typeof ClientGetCustomAppPageContextV1Response>;
    };
    "set-popup-size@1.0.0": {
      request: z.infer<typeof ClientSetPopupSizeV1Request>;
      response: z.infer<typeof ClientSetPopupSizeV1Response>;
    };
  };
};
