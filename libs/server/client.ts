import { PrismaClient } from "@prisma/client";
//이파일을 실행하게되면 gloval.client에 아무것도 들어있지 않을거얌  그래서 새 PrismaClient를 만듬 있으면 생략.

declare global {
  var client: PrismaClient | undefined;
}

const client = global.client || new PrismaClient();

if (process.env.NODE_ENV === "development") global.client = client;

export default client;