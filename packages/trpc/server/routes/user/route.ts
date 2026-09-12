import { userService } from "../../services";
import { authenticationProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithClerkIdInputModel,
  createUserWithClerkIdOutputModel,
  getUserByClerkIdInputModel,
  getUserByClerkIdOutputModel,
} from "./model";

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

  getUserByClerkId: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getUserByClerkId"),
        tags: TAGS,
      },
    })
    .input(getUserByClerkIdInputModel)
    .output(getUserByClerkIdOutputModel)
    .query(async ({ input }) => {
      const { clerkId } = input;

      const result = await userService.getUserByClerkId({ clerkId });
      return result;
    }),
});
