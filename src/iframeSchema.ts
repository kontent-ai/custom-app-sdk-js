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

type ErrorMessage = z.infer<typeof ErrorMessage>;

const ClientInitV1Request = z
  .object({
    type: z.literal('init-request'),
    requestId: z.string().uuid(),
    version: z.literal('1.0.0'),
    payload: z.null(),
  })
  .readonly();

type ClientInitV1Request = z.infer<typeof ClientInitV1Request>;

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
  .readonly();

type ClientInitV1Response = z.infer<typeof ClientInitV1Response>;

const ClientInitV2Request = z
  .object({
    type: z.literal('init-request'),
    requestId: z.string().uuid(),
    payload: z.object({ p: z.string() }).readonly(),
    version: z.literal('2.0.0'),
  })
  .readonly();

type ClientInitV2Request = z.infer<typeof ClientInitV2Request>;

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
  .readonly();

type ClientInitV2Response = z.infer<typeof ClientInitV2Response>;

const GetV1Request = z
  .object({
    type: z.literal('get-request'),
    requestId: z.string().uuid(),
    version: z.literal('1.0.0'),
    payload: z.null(),
  })
  .readonly();

type GetV1Request = z.infer<typeof GetV1Request>;

const GetV1Response = z
  .object({
    type: z.literal('get-response'),
    requestId: z.string().uuid(),
    version: z.literal('1.0.0'),
    payload: z.null(),
  })
  .readonly();

type GetV1Response = z.infer<typeof GetV1Response>;

const HostPingV1Request = z.object({
  type: z.literal('ping-request'),
  version: z.literal('1.0.0'),
  payload: z.boolean(),
});

type HostPingV1Request = z.infer<typeof HostPingV1Request>;

export type CustomAppMessage =
  | [ClientInitV1Request, ClientInitV1Response | ErrorMessage]
  | [ClientInitV2Request, ClientInitV2Response | ErrorMessage]
  | [GetV1Request, GetV1Response | ErrorMessage];

export type Schema = {
  client: {
    'init@1.0.0': {
      request: ClientInitV1Request;
      response: ClientInitV1Response;
    };
    'init@2.0.0': {
      request: ClientInitV2Request;
      response: ClientInitV2Response;
    };
    'get@1.0.0': {
      request: GetV1Request;
      response: GetV1Response;
    };
  };
  host: {
    'ping@1.0.0': {
      request: HostPingV1Request;
      response: null;
    };
  };
};
