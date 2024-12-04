import type { z } from "zod";

export const matchesSchema = <Output>(schema: z.ZodType<Output>, data: unknown): data is Output =>
  schema.safeParse(data).success;
