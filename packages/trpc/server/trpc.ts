import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { formService } from "./services";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticationProcedure = tRPCContext.procedure.use(async ({ ctx, next }) => {
  const { checkAuthenticationUser } = ctx;
  const { clerkId, isAuthenticated } = checkAuthenticationUser();

  if (!isAuthenticated || !clerkId) {
    throw new Error("Unauthenticated request");
  }

  const { userId } = await formService.getUserByClerkId(clerkId);
  return next({
    ctx: { clerkId, userId },
  });
});
