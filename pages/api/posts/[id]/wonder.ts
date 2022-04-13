import { Post } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
    session: { user },
  } = req;

  // wondering에서 현재 로그인 한 userId와 postId가 동시에 일치하는 record가 있는지 확인한다.
  const alreadyExist = await client.wondering.findFirst({
    where: {
      userId: user?.id, // userId가 같고
      postId: +id.toString(), // postId가 같은 것이 있는지,
    },
  });

  // 만약 alreadyExist가 true 라면, 삭제하고, false라면 생성한다. => 이것이 곧 '궁금해요' 버튼을 구현하는 방식이다.
  if (alreadyExist) {
    await client.wondering.delete({
      where: {
        id: alreadyExist.id,
      },
    });
  } else {
    // wondering은 post와 user의 정보가 필요하다. relation되어 있는 정보 이기 때문에 connect를 이용해서 가져온다.
    await client.wondering.create({
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
      },
    });
  }

  console.log(alreadyExist);

  res.json({
    ok: true,
  });
};

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
