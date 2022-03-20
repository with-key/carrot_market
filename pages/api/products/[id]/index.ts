import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { id },
  } = req;

  // db에서 product 조회
  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  // 관련 항목 문자열 추출하기
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));

  // 관련 항목 조회 쿼리
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  // isLiked의 역할 : 해당 상품을 현재 유저가 '좋아요' 누른 상태인지 아닌지 알려준다.
  // 현재 유저의 정보와 현재 상품의 아이디를 and 조건으로 충족하는 상품을 조회하고, 그 상품의 fav 여부를 확인
  // fav - user - product의 관계
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  res.json({ ok: true, product, isLiked, relatedProducts });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
