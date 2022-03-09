import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type ConfigType = {
  method: "GET" | "POST" | "DELETE";
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean; // false => 로그인 한 사람만 접속 가능, true => 아무나 접속 가능
};

export default function withHandler({
  method,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method !== method) {
      return res.status(405).end();
    }

    // user가 로그인 하지 않았을 때 접속을 제한한다.
    if (isPrivate && !req.session.user) {
      return res.status(401).json({
        ok: false,
        error: "Plz log in",
      });
    }

    try {
      await handler(req, res);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
