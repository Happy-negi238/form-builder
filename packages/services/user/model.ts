import { email, z } from "zod";

export const createUserWithClerkIdInput = z.object({
  clerkId: z.string().describe("Clerk Id of user"),
  firstName: z.string().describe("First name of user"),
  lastName: z.string().describe("Last name of user").optional(),

  email: z.email().describe("Email of user"),
  profileImageUrl: z.string().describe("Profile image url of user").optional(),
  role: z.enum(["ADMIN", "USER"]).describe("Role of user").default("USER"),
});

export type CreateUserWithClerkIdInputType = z.infer<typeof createUserWithClerkIdInput>;

export const generateUserTokenPayload = z.object({
  id: z.string().describe("uuid of user"),
});

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;

export const getUserByClerkIdInput = z.object({
  clerkId: z.string().nullable().describe("Clerk Id of user"),
});

export type GetUserByClerkIdInputType = z.infer<typeof getUserByClerkIdInput>;
