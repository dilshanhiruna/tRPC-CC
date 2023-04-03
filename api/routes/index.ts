import { adminProcedure, t } from "../trpc";
import { userRouter } from "./users";

export const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return "hi";
  }),
  logServer: t.procedure
    .input((v) => {
      if (typeof v === "string") {
        return v;
      }
      throw new Error("invalid input");
    })
    .mutation((input) => {
      console.log(input);
      return "ok";
    }),
  users: userRouter,
  secretData: adminProcedure.query(({ ctx }) => {
    console.log(ctx.user);
    return "secret";
  }),
});

export const mergedRouter = t.mergeRouters(appRouter, userRouter);
