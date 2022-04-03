import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // fav를 하는 user와 product을 알아야 함
  const {
    query: { id },
    session: { user },
  } = req;

  /**
   * db에 fav가 존재하는 지 확인
   * findUnique를 사용하지 않는 이유는, findUnique는 @unique 만 조회할 수 있기 때문. 그래서 findFirst를 사용,
   * 좀 더 넓은 조건으로 검색할 수 있음
   */

  // Fav Table에서 현재 머물고 있는 페이지의 userId 와 productId가 같은 항목(product)을  찾는다.
  const alreadyExists = await client.fav.findFirst({
    where: {
      productId: +id.toString(), // 현재 조회하고 있는 product의 productId 와,
      userId: user?.id, // 현재 session에 등록된 userId 에서,
    },
  });

  // 만약 fav table에 userId, productId가 모두 일치하는 항목이 있다면
  // 그것(alreadyExists)은 해당 product에 '좋아요'가 true 라는 것이다.
  if (alreadyExists) {
    // alreadyExists 가 있다면 그것을 찾아서 삭제한다.
    await client.fav.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    // fav에 alreadyExists가 없다면, 생성해서 넣는다.
    // fav가 있다는 것은 곧 '좋아요'가 true라는 것이다.
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
