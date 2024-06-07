const code = {};
class AuthorizationCode {
  constructor(code, clientId, redirectURI, userId, scope) {
    this.code = code;
    this.clientId = clientId;
    this.redirectURI = redirectURI;
    this.userId = userId;
    this.scope = scope;
  }

  save(done) {
    console.log("AuthorizationCode.save");
    code[this.code] = {
      clientId: this.clientId,
      redirectUri: this.redirectURI,
      userId: this.userId,
      scope: this.scope,
    };
    done(null);
  }

  static findOne(c, done) {
    console.log("AuthorizationCode.findOne: ",code);
    if (code[c]) {
      return done(null, code[c]);
    }
    return done(null, null);
  }
}

const token = {};
class AccessToken {
  constructor(token, userId, clientId, scope) {
    this.token = token;
    this.userId = userId;
    this.clientId = clientId;
    this.scope = scope;
  }
  save(done) {
    token[this.token] = {
      userId: this.userId,
      clientId: this.clientId,
      scope: this.scope,
    };
    console.log("AccessToken.save---",token);
    done(null);
  }
}

const client = {
  "00001": {
    id: "00001",
    name: "测试",
    redirectUri: "http://127.0.0.1:5173",
    clientSecret: "00001-1",
  },
};
class Client {
  constructor(id, secret) {
    this.id = id;
    this.secret = secret;
  }

  static findOne(id, done) {
    console.log("Client.find");
    if (client[id]) {
      return done(null, client[id]);
    }
    return done(null, null);
  }
}

const user = [
  {
    id: "00001",
    username: "wxs",
    password: "123456",
  },
];

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
  static findOne(username, done) {
    for (const element of user) {
      if (element.username === username) {
        return done(null, {
          ...element,
          verifyPassword(password) {
            return this.password === password;
          },
        });
      }
    }
    return done(null, null);
  }
}

module.exports = {
  AuthorizationCode,
  AccessToken,
  Client,
  User,
};
