/*
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-06-07 20:27:11
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-06-08 03:15:34
 * @FilePath: \passport-oauth2\oauth2orize\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require("express");
const login = require("connect-ensure-login");
const session = require("express-session");
const cors = require("cors");

const { server, authorize } = require("./oauth2");

const passport = require("./passport");

const app = express();
// 配置cors中间件
app.use(
  cors({
    origin: "http://localhost:3001", // 允许的源
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // 允许发送cookie
  })
);
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/static", express.static("static"));

app.get(
  "/dialog/authorize",
  (req,res,next)=>{
    // req.session.client_id = req.query.client_id;
    // req.session.response_type = req.query.response_type;
    req.session.client_id = req.headers.client_id;
    req.session.response_type = req.headers.response_type;
    req.session.redirect_uri = req.query.redirect_uri;
    next()
  },
  login.ensureLoggedIn({
    redirectTo: "/oauth2/login",
  }),
  authorize,
  function (req, res) {
    // res.render("dialog", {
    //   transactionID: req.oauth2.transactionID,
    //   user: req.user,
    //   client: req.oauth2.client,
    // });
    const transactionID = req.oauth2.transactionID;
    const user = req.user;
    const client = req.oauth2.client;
    const redirectUrl = `/dialog?transactionID=${transactionID}&user=${encodeURIComponent(
      user.username
    )}&client=${encodeURIComponent(client.name)}`;
    // res.redirect(redirectUrl);
    res.status(304).setHeader("Location", redirectUrl).end();
  }
);

app.post(
  "/token",
  passport.authenticate(["oauth2-client-password"], {
    session: false,
  }),
  server.token(),
  server.errorHandler()
);

app.get(
  "/api/userinfo",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    res.json(req.user);
  }
);

app.get("/login", (req, res) => {
  // res.redirect(`/static/login.html?client_id=${req.session.client_id}&response_type=${req.session.response_type}&redirect_uri=${req.session.redirect_uri}`);
  res.status(304).setHeader("Location", `http://localhost:5000/static/login.html?client_id=${req.session.client_id}&response_type=${req.session.response_type}&redirect_uri=${req.session.redirect_uri}`).end();
});
app.get("/dialog", (req, res) => {
  const queryParams = new URLSearchParams(req.query);
  res.redirect(`/static/dialog.html?${queryParams.toString()}`);
});
app.post(
  "/dialog/authorize/decision",
  login.ensureLoggedIn(),
  server.decision(),
  (req, res) => {
    console.log("Inside the final middleware after server.decision");
    const authCode = req.oauth2.code;
    const redirectUri = req.oauth2.client.redirectUri;
    const redirectUrl = `${redirectUri}?code=${authCode}`;
    res.redirect(redirectUrl);
  }
);

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    console.log('11111111111');
    // 构建重定向 URL 并附加 OAuth 2.0 参数
    const redirectUrl = `/dialog/authorize?response_type=${
      req.body.response_type
    }&client_id=${req.body.client_id}&redirect_uri=${encodeURIComponent(
      req.body.redirect_uri
    )}`;
    res.redirect(redirectUrl);
  }
);

app.get("/", (req, res) => {
  res.send("oauth2orize");
});

app.listen(5000, function () {
  console.log("Server is running on http://localhost:5000");
});
