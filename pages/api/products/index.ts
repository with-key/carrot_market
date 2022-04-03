import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            favs: true,
          },
        },
      },
    });

    res.status(200).json({
      ok: true,
      products,
    });
  }

  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;

    // Prisma
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        favsCount: 0,
        image: "xxx",
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      product,
    });
  }
}

// 인자가 2개 이상 많아지는 것은 지양하고 object 형태로 사용, key가 있어서
// value가 어떤 것인지 직관적으로 알 수 있다.
export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
