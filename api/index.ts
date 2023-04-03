import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { mergedRouter } from "./routes";
import { createContext } from "./context";
import ws from "ws";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(
  "/trpc",
  createExpressMiddleware({
    router: mergedRouter,
    createContext,
  })
);

app.use(express.json());

const server = app.listen(4200, () => {
  console.log("Example app listening on port 4200!");
});

applyWSSHandler({
  wss: new ws.Server({ server }),
  router: mergedRouter,
  createContext,
});

export type AppRouter = typeof mergedRouter;
