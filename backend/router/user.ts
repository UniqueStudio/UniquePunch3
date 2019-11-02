import Router from "koa-router";

const router = new Router({ prefix: "/user" });
router.post("/login").post("/register");

export default router;
