import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";



async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) { 
    const { id } = req.query;
    const product = await client.product.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            user: {//전체
                select: {  //선택
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
    const terms = product?.name.split(" ").map((word) => ({
        name: {
          contains: word,
        },
      }));

// OR
// 하나 이상의 조건이 true를 반환해야 합니다.
// ex) title 필드에 Prisma 또는 databases가 포함된 모든 Post 레코드 가져오기
// https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#or

// AND
// 모든 조건이 true를 반환해야 합니다.
// https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#and

// 연관된 상품을 가져올 때 가장 최근에 올라온 상품을 기준으로 특정 갯수만큼만 가져오려면 where 뒤에 orderBy와 take을 사용하시면 됩니다.

      const relatedProducts = await client.product.findMany({
        where: {
          OR: terms,
          AND: {
            id: {
              not: product?.id,  //연관상품에 내건 뺴고
            },
          },
        },
        take: 4,
      });
      res.json({ ok: true, product, relatedProducts });
}
     
export default withApiSession(
    withHandler({
        methods: ["GET"],
        handler,
    })
);
