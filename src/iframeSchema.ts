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

export type Schema = {
  client: {
    "get-context@1.0.0": {
      request: z.infer<typeof ClientGetContextV1Request>;
      response: z.infer<typeof ClientGetContextV1Response>;
    };
  };
};
