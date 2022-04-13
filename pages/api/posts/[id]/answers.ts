import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    session: { user },
    body: { answer }, // client에서 받아오는 body
  } = req;

  // query
  // 댓글에 필요한 정보
  // id가 user.id인 user record 정보 전체를 연결시켜서 answer에 user info를 담아 create 한다.

  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: +id.toString(),
        },
      },
      answer,
    },
  });

  // result
  res.json({
    ok: true,
    answer: newAnswer,
  });
};

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
