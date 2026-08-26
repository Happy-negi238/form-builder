import { z } from "zod";

export const createUserWithClerkIdInputModel = z.object({
  clerkId: z.string().describe("Clerk Id of user"),
  firstName: z.string().describe("First name of user"),
  lastName: z.string().describe("Last name of user").optional(),

  email: z.email().describe("Email of user"),
  profileImageUrl: z.string().describe("Profile image url of user").optional(),
  role: z.enum(["ADMIN", "USER"]).describe("Role of user").default("USER"),
});

export const createUserWithClerkIdOutputModel = z.object({
  id: z.string().describe("user created id"),
});
