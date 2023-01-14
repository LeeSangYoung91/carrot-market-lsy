
  // (SMS, EMAIL)로 받은 토큰 입력 → 해당 토큰이 존재 → 토큰에 연결된 UserID 세션에 저장 (Authentication) 
// → 인증 후, 사용된 토큰 삭제 (+ 인증된 유저와 연결된 모든 토큰 삭제)
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body; //req.body에 토큰을 받아보냄

  //토큰을 찾아봄
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
  });

  //토큰이 없으면 
  if (!foundToken) return res.status(404).end();

  //토큰이 있으면 token을 보유한 유저의 id를 req.session.user에 넣음
  req.session.user = {
    id: foundToken.userId,
  };

  //session 을 저장
  await req.session.save();

  //여기서 찾은 token의 userid와 같은 id를 가진 token을 전부 삭제  쉽게말하면 토큰을찾아봄에 토큰을 삭제함 token을 한번만 쓰게 
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);