import request from "./index";

export function login(params) {
  return request.get("/oauth2/dialog/authorize", {
    params,
  });
}

export function callback(params) {
  return request.post("/oauth2/token",params);
}
