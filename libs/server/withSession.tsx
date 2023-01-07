import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "carrotsession",
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}


// 모든 API 경로 파일 또는 페이지에서 비밀번호와 쿠키 이름을 전달하지 않으려면 다음과 같이 래퍼를 만들 수 있습니다.

// import { withIronSessionApiRoute } from "iron-session/next";

// const sessionOptions = {
// cookieName: "myapp_cookiename",
// password: "complex_password_at_least_32_characters_long",
// // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
// cookieOptions: {
// secure: process.env.NODE_ENV === "production",
// },
// };

// export function withSessionRoute(handler: NextApiHandler) {
// return withIronSessionApiRoute(handler, sessionOptions);
// }
