// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { userRouter } from "./user";
import { profileRouter } from "./profile";
import { replayRouter } from "./replay";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("profile.", profileRouter)
  .merge("replay.", replayRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
