const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.get("/login", async (req, res) => {
  console.log(req.headers);
  const client_id = req.headers.client_id;
  const response_type = req.headers.response_type;
  const redirect_uri = req.query.redirect_uri;
  console.log({
    client_id,
    response_type,
    redirect_uri,
  });
  const authorization = req.headers.authorization;
  // authorization 有没有效
  // 没有效，去login中央服务器获取授权码
  const oauth2AuthorizeUrl = `http://localhost:5000/dialog/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  res.status(304).setHeader("Location", oauth2AuthorizeUrl).end();
});

// app.get("/callback", async (req, res) => {
//     const authorizationCode = req.query.code;
//     console.log("req.query---", req.query);
//     try {
//       const response = await axios.post("http://localhost:5000/token", {
//         grant_type: "authorization_code",
//         code: authorizationCode,
//         redirect_uri: "http://localhost:5173",
//         client_id: "00001",
//         client_secret: "00001-1",
//       });

//       const accessToken = response.data.access_token;
//       // 将访问令牌存储在会话中或以其他方式返回给前端
//       req.session.access_token = accessToken;
//       res.send({
//         accessToken,
//       });
//     } catch (error) {
//       res.status(500).send("Failed to obtain access token");
//     }
//   });

app.post("/callback", async (req, res) => {
  const { code, redirect_uri, client_id, client_secret, grant_type } = req.body;
  const response = await axios.post("http://localhost:5000/token", {
    grant_type,
    code,
    redirect_uri,
    client_id,
    client_secret,
  });
  res.send(response.data);
});

app.listen(3001, function () {
  console.log("Server is running on http://localhost:3001");
});
