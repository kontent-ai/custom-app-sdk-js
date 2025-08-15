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

const ClientGetPageContextV1Request = z
  .object({
    type: z.literal("get-page-context-request"),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
    payload: z.null(),
  })
  .readonly();

const basePageContextProperties = {
  route: z
    .object({
      path: z.string(),
      params: z.record(z.string()),
      query: z.record(z.string()),
    })
    .readonly(),
  page: z
    .object({
      title: z.string(),
      breadcrumbs: z
        .array(
          z
            .object({
              label: z.string(),
              path: z.string().optional(),
            })
            .readonly()
        )
        .readonly(),
    })
    .readonly(),
};

const ItemEditorPageContextSchema = z
  .object({
    ...basePageContextProperties,
    pageType: z.literal("item-editor"),
    contentItem: z
      .object({
        id: z.string().uuid(),
        codename: z.string(),
        name: z.string(),
        type: z
          .object({
            id: z.string().uuid(),
            codename: z.string(),
          })
          .readonly(),
        language: z
          .object({
            id: z.string().uuid(),
            codename: z.string(),
          })
          .readonly(),
        workflowStep: z
          .object({
            id: z.string().uuid(),
            codename: z.string(),
          })
          .readonly()
          .optional(),
      })
      .readonly(),
    editor: z
      .object({
        validationErrors: z.record(z.string(), z.array(z.string()).readonly()).readonly(),
        elements: z
          .array(
            z
              .object({
                id: z.string(),
                type: z.string(),
                value: z.string(),
              })
              .readonly()
          )
          .readonly(),
      })
      .readonly(),
  })
  .readonly();

const OtherPageContextSchema = z
  .object({
    ...basePageContextProperties,
    pageType: z.literal("other"),
  })
  .readonly();

const PageContextSchema = z.union([
  ItemEditorPageContextSchema,
  OtherPageContextSchema,
]);

const ClientGetPageContextV1Response = z
  .object({
    type: z.literal("get-page-context-response"),
    isError: z.boolean(),
    payload: z
      .object({
        pageContext: PageContextSchema.nullable(),
      })
      .readonly(),
    requestId: z.string().uuid(),
    version: z.literal("1.0.0"),
  })
  .or(ErrorMessage)
  .readonly();

export const AllClientRequestMessages = z.union([
  ClientGetContextV1Request,
  ClientGetPageContextV1Request,
]);

export type Schema = {
  client: {
    "get-context@1.0.0": {
      request: z.infer<typeof ClientGetContextV1Request>;
      response: z.infer<typeof ClientGetContextV1Response>;
    };
    "get-page-context@1.0.0": {
      request: z.infer<typeof ClientGetPageContextV1Request>;
      response: z.infer<typeof ClientGetPageContextV1Response>;
    };
  };
};
