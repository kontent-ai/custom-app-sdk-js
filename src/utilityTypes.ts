import type { CustomAppMessage } from './iframeSchema';

export type GetRequestModelFor<
  TType extends CustomAppMessage[0]['type'],
  TVersion extends CustomAppMessage[0]['version'],
> = CustomAppMessage[0] extends infer TMessage
  ? TMessage extends { readonly type: TType; readonly version: TVersion }
    ? TMessage
    : never
  : never;

export type GetResponseModelFor<
  TType extends CustomAppMessage[0]['type'],
  TVersion extends CustomAppMessage[0]['version'],
> = CustomAppMessage extends infer TPair
  ? TPair extends [unknown, unknown]
    ? TPair[0] extends { readonly type: TType; readonly version: TVersion }
      ? TPair[1]
      : never
    : never
  : never;
