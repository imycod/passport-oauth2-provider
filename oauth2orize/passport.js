const passport = require("passport");
const ClientPasswordStrategy =
  require("passport-oauth2-client-password").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const BasicStrategy = require("passport-http").BasicStrategy;

const { Client, AccessToken, User } = require("./store");
// passport.use(new BasicStrategy(
//   function(username, password, done) {
//     // 验证用户名和密码
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

passport.serializeUser(function (user, done) {
  console.log("serializeUser----", user);
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  console.log("deserializeUser----", username);
  User.findOne(username, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new ClientPasswordStrategy(function (clientId, clientSecret, done) {
    Client.findOne(clientId, function (err, client) {
      if (err) {
        return done(err);
      }
      if (!client) {
        return done(null, false);
      }
      if (client.clientSecret != clientSecret) {
        return done(null, false);
      }
      return done(null, client);
    });
  })
);

passport.use(
  new BearerStrategy(function (accessToken, done) {
    AccessToken.findOne(accessToken, function (err, token) {
      if (err) {
        return done(err);
      }
      if (!token) {
        return done(null, false);
      }
      return done(null, token, { scope: token.scope });
    });
  })
);

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne(username, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

module.exports = passport;
