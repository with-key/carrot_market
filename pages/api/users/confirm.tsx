import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

// User의 phone 번호를 입력 받고, 해당 유저가 존재하는 유저인지 확인한다.
// 만약 해당 유저가 존재한다면 foundToken 라는 session에 해당 유저의 정보를 삽입한다.
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: { user: true }, // exists에 user 정보를 삽입, db에서 relation이 연결되어 있어야 가능
  });

  if (!foundToken) return res.status(404).end();

  // session에 user의 id를 저장한다.
  // session에 user와 같이 임의로 이름을 정할 수 있다
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save(); // 생성한 session을 저장하는 명령

  // 토큰이 사용되면 모두 삭제된다.
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });
  res.status(200).json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    method: "POST",
    handler,
    isPrivate: false,
  })
);
