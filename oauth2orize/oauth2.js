const oauth2orize = require("oauth2orize");
const { AuthorizationCode, AccessToken, Client } = require("./store");
const crypto = require("crypto");

const server = oauth2orize.createServer();

function uid(length) {
  return crypto.randomBytes(length).toString("hex");
}

server.serializeClient(function (client, done) {
  console.log("serializeClient----client----", client);
  return done(null, client.id);
});

server.deserializeClient(function (id, done) {
  console.log("deserializeClient----client----", id);
  Client.findOne(id, function (err, client) {
    if (err) {
      return done(err);
    }
    return done(null, client);
  });
});

server.grant(
  oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
    console.log("client, redirectURI, user----", {
      client,
      redirectURI,
      user,
      ares,
    });
    const code = uid(16);

    const ac = new AuthorizationCode(
      code,
      client.id,
      redirectURI,
      user.id,
      ares.scopeF
    );
    console.log("AuthorizationCode----", ac);
    ac.save(function (err) {
      if (err) {
        return done(err);
      }
      console.log("code----", code);
      return done(null, code);
    });
  })
);

server.exchange(
  oauth2orize.exchange.code(function (client, code, redirectURI, done) {
    console.log("exchange --- code ---- client, code, redirectURI----", {
      client,
      code,
      redirectURI,
    });
    AuthorizationCode.findOne(code, function (err, code) {
      console.log("AuthorizationCode---code---", code);
      if (err) {
        return done(err);
      }
      if (client.id !== code.clientId) {
        return done(null, false);
      }
      console.log('AuthorizationCode----',2);
      if (redirectURI !== code.redirectUri) {
        return done(null, false);
      }
      console.log('AuthorizationCode----',1);

      const token = uid(256);
      const at = new AccessToken(token, code.userId, code.clientId, code.scope);
      console.log("at-----", at);
      at.save(function (err) {
        if (err) {
          return done(err);
        }
        console.log("token-----", token);
        return done(null, token);
      });
    });
  })
);

module.exports = {
  server,
  authorize: server.authorize(function (clientID, redirectURI, done) {
    console.log("redirectURI---", redirectURI);
    Client.findOne(clientID, function (err, client) {
      console.log("client---", client);
      if (err) {
        return done(err);
      }
      if (!client) {
        return done(null, false);
      }
      if (client.redirectUri != redirectURI) {
        return done(null, false);
      }
      return done(null, client, client.redirectUri);
    });
  }),
};
