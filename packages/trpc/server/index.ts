import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { userRouter } from "./routes/user/route";
import { formRouter } from "./routes/form/route";

export const serverRouter = router({
  health: healthRouter,
  user: userRouter,
  form: formRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
