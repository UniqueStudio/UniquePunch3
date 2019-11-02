import * as Koa from "koa";
import * as jwt from "koa-jwt";
import * as body from "koa-body";

const app = new Koa();

app.use(async (ctx, next) => {
  const startTime = Date.now();
  await next();
  const processTime = Date.now() - startTime;
  console.log(`${ctx.method} ${ctx.url} from ${ctx.ip} in ${processTime}ms`);
});

app.use(body);

app.use(ctx => {
  ctx.body = "test";
});

app.listen(3000);
