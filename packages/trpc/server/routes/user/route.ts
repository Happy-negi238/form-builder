import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createUserWithClerkIdInputModel, createUserWithClerkIdOutputModel } from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const userRouter = router({
  createUserWithClerkId: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithClerkId"),
        tags: TAGS,
      },
    })
    .input(createUserWithClerkIdInputModel)
    .output(createUserWithClerkIdOutputModel)
    .mutation(async ({ input }) => {
      const { clerkId, firstName, lastName, email, profileImageUrl, role } = input;
      const { id } = await userService.createUserWithClerkId({
        clerkId,
        firstName,
        lastName,
        email,
        profileImageUrl,
        role,
      });

      return { id };
    }),
});
