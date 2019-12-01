import { Middleware } from "koa";

export const logger: Middleware = async (ctx, next) => {
  const startTime = Date.now();
  await next();
  const processTime = Date.now() - startTime;
  console.log(`${ctx.method} ${ctx.url} from ${ctx.ip} in ${processTime}ms`);
};
