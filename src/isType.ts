import type { z } from 'zod';

export const isType = <Output>(schema: z.ZodType<Output>, data: unknown): data is Output =>
  schema.safeParse(data).success;
