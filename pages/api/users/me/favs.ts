import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  const favs = await client.fav.findMany({
    // where은 마치 filter와 같으며 안에서는 찾고자 하는 컴럼을 넣는다.
    where: {
      userId: user?.id,
    },
  });

  res.json({
    ok: true,
    favs,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
