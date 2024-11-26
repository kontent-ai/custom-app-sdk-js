import { z } from 'zod';

enum ErrorCode {
  Nnn = 'Nnn',
}

export const ErrorMessage = z
  .object({
    requestId: z.string().uuid(),
    isError: z.boolean(),
    code: z.nativeEnum(ErrorCode),
    description: z.string(),
  })
  .readonly();

const ClientInitV1Request = z
  .object({
    type: z.literal('init-request'),
    requestId: z.string().uuid(),
    version: z.literal('1.0.0'),
    payload: z.null(),
  })
  .readonly();

const ClientInitV1Response = z
  .object({
    type: z.literal('init-response'),
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
                    codename: z.string(),
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
    version: z.literal('1.0.0'),
  })
  .or(ErrorMessage)
  .readonly();

const ClientInitV2Request = z
  .object({
    type: z.literal('init-request'),
    requestId: z.string().uuid(),
    payload: z.object({ p: z.string() }).readonly(),
    version: z.literal('2.0.0'),
  })
  .readonly();

const ClientInitV2Response = z
  .object({
    type: z.literal('init-response'),
    payload: z
      .object({
        context: z.object({}).readonly(),
        config: z.object({}).readonly().or(z.null()),
      })
      .readonly(),
    requestId: z.string().uuid(),
    version: z.literal('2.0.0'),
  })
  .or(ErrorMessage)
  .readonly();

const GetV1Request = z
  .object({
    type: z.literal('get-request'),
    requestId: z.string().uuid(),
    version: z.literal('1.0.0'),
    payload: z.null(),
  })
  .readonly();

const GetV1Response = z
  .object({
    type: z.literal('get-response'),
    requestId: z.string().uuid(),
    version: z.literal('1.0.0'),
    payload: z.null(),
  })
  .or(ErrorMessage)
  .readonly();

const HostItemDeletedRequest = z.object({
  type: z.literal('item-deleted-request'),
  requestId: z.string().uuid(),
  version: z.literal('1.0.0'),
  payload: z.object({ itemId: z.string().uuid() }).readonly(),
});

export type Schema = {
  client: {
    'init@1.0.0': {
      request: z.infer<typeof ClientInitV1Request>;
      response: z.infer<typeof ClientInitV1Response>;
    };
    'init@2.0.0': {
      request: z.infer<typeof ClientInitV2Request>;
      response: z.infer<typeof ClientInitV2Response>;
    };
    'get@1.0.0': {
      request: z.infer<typeof GetV1Request>;
      response: z.infer<typeof GetV1Response>;
    };
  };
  host: {
    'item-deleted@1.0.0': {
      request: z.infer<typeof HostItemDeletedRequest>;
      response: null;
    };
  };
};
