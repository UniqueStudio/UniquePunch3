import Koa from "koa";
import serve from "koa-static";
import cors from "koa2-cors";
import Router from "koa-router";
import { readFileSync } from "fs";

import { logger } from "./controller/middlewares";
import { screenshotThenExit } from "./screenshot";

const app = new Koa();
const router = new Router();

router.get("/punch", async (ctx, next) => {
  const punchJsonBuffer = readFileSync("./punch.json");
  ctx.response.body = punchJsonBuffer.toString();
  next();
});

// app.use(logger);
app.use(cors());
app.use(serve("."));
app.use(serve("../frontend/dist/frontend"));
app.use(router.routes()).use(router.allowedMethods());

export const serverStart = async () => {
  app.listen(5000, () => {
    console.log("running on http://localhost:5000");
    screenshotThenExit();
  });
};
