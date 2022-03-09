import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookiesOptions = {
  cookieName: "carrotsessions",
  password: process.env.SESSION_PASSWORD!, // 초기 타입이 string | undefined 이기 때문에 type assertion을 한다.
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookiesOptions);
}
