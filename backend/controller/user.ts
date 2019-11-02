import { Middleware } from "koa";

interface IRequestLogin {
  username: string;
  password: string;
}

export const login: Middleware = async (ctx, next) => {
  const { username, password } = ctx.request.body as IRequestLogin;
};
