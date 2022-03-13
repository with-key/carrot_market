import { NextApiRequest, NextApiResponse } from "next";

export type ResponseType = {
  ok: boolean;
  [key: string]: any;
};

type method = "GET" | "POST" | "DELETE";

type ConfigType = {
  methods: method[]; // 하나의 path variable로 여러개의 method를 허용하기 위해 리팩토링함 (resuful 사양서에 맞추기 위함)
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean; // false => 로그인 한 사람만 접속 가능, true => 아무나 접속 가능
};

export default function withHandler({
  methods,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    // req의 method가 methods에 없다면, error
    if (req.method && !methods.includes(req.method as any)) {
      // methods의 항목들은 유니온타입이기 때문에 일반 string 타입이 들어갈 수 없어서 as any 로 해줌 (또는 as method)
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
