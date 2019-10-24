import * as Koa from "koa"
import * as jwt from "koa-jwt"

const app = new Koa();

app.use(ctx=>{
    ctx.body = "test"
});

app.listen(3000);