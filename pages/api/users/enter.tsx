import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import smtpTransport from "@libs/server/email";

//   connect

//Restart your typescript server in VSCode CTRL + SHIFT + P then type: restart TS Server
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body;
  //  const user = phone ? { phone: +phone } : email ? { email } : null;
    const user = phone ? { phone } : email ? { email } : null;
    if (!user) return res.status(400).json({ ok: false });
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    console.log({...user});


    const alreadyExists = await client.user.findFirst({
      where: {
        ...user
      },
      select: {
        id: true,
      },
    });
    console.log(alreadyExists);
    
    const token = await client.token.create({
   
        data: {
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...user,
                    },
                    create: {
                        name: "Anonymous",
                        ...user,
                    },
                },
            },
        },
        
    });
    console.log(payload);



    // if (phone) {
    //     const message = await twilioClient.messages.create({
    //         messagingServiceSid: process.env.TWILIO_MSID,
    //         to: process.env.MY_PHONE!,
    //         body: `Your login token is ${payload}.`,
    //     });
    //     console.log(message);
    // }
    // if (email) {
    //     const mailOptions = {
    //         from: process.env.MAIL_ID,
    //         to: email,
    //         subject: "Nomad Carrot Authentication Email",
    //         text: `Authentication Code : ${payload}`,
    //     };
    //     const result = await smtpTransport.sendMail(
    //         mailOptions,
    //         (error, responses) => {
    //             if (error) {
    //                 console.log(error);
    //                 return null;
    //             } else {
    //                 console.log(responses);
    //                 return null;
    //             }
    //         }
    //     );
    //     smtpTransport.close();
    //     console.log(result);
    // }
    //const payload = phone ? { phone: +phone } : { email };  //phone이 있다면 { phone: +phone }  없다면 email
    //upsert : 조회하고 존재하는 데이터가 있다면 db에서 가져옴
    // const user = await client.user.upsert({
    //   where: {
    //     ...payload,
    //   },
    //   create: {
    //     //user를 못찾으면
    //     name: "Anonymous",
    //     ...payload,
    //   },
    //   update: {},
    // });
    // const token = await client.token.create({
    //   data:{
    //     payload: "12333",
    //     user:{
    //       connect:{
    //         id: user.id,
    //       }
    //     }

    //   }
    // })
    // console.log(token);
    /* if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) console.log("found it.");
    if (!user) {
      console.log("Did not find. Will create.");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          email,
        },
      });
    }
    console.log(user);
  }
  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone,  --문자를 숫자로 변환시키기 위해  숫자를 문자로는 -> +""
      },
    });
    if (user) console.log("found it.");
    if (!user) {
      console.log("Did not find. Will create.");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          phone: +phone,
        },
      });
    }
    console.log(user);
  } */
    return res.json({
        ok: true,
    });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });