import { t } from "../trpc";
import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "stream";

const userProcedure = t.procedure.input(z.object({ id: z.string() }));
const eventEmitter = new EventEmitter();

export const userRouter = t.router({
  getUser: userProcedure.query((input) => {
    return { id: input };
  }),
  update: userProcedure
    .input(z.object({ name: z.string() }))
    .output(z.object({ id: z.string(), name: z.string() }))
    .mutation((req) => {
      eventEmitter.emit("update", req.input.name);
      return {
        id: req.input.id as string,
        name: req.input.name,
        password: "123",
      };
    }),
  onUpdate: t.procedure.subscription(() => {
    return observable<string>((emit) => {
      eventEmitter.on("update", emit.next);

      return () => {
        eventEmitter.off("update", emit.next);
      };
    });
  }),
});
