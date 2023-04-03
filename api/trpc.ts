import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { createContext } from "./context";

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

const isAdminMiddlware = t.middleware(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: {
        id: 1,
      },
    },
  });
});

export const adminProcedure = t.procedure.use(isAdminMiddlware);
