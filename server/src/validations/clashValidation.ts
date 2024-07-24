import { z } from "zod";

export const clashSchema = z.object({
  title: z
    .string({ message: "Name is required" })
    .min(2, { message: "Length must be 2 characters long" })
    .max(60, { message: "Length must be below 60 characters" }),
  description: z
    .string()
    .max(500, { message: "Lenght must be below 500 characters" })
    .optional(),
  expire_at: z
    .string({ message: "Expire at is required." })
    .min(5, { message: "Please pass correct date" }),
  image: z.string().optional(),
});
