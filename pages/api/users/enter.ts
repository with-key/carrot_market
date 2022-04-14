// import mail from "@sendgrid/mail";
import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

// mail.setApiKey(process.env.SENDGRID_KEY!);
// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // client input에서 넘어온 정보
  const { phone, email } = req.body;

  // user는 { } 인데, phone에서 입력되었으면, user: { phone: phone },
  // email에서 입력되었으면, user: { email: email} 으로 선언된다.
  const user = phone ? { phone } : email ? { email } : null;

  // 만약 현재 user 정보가 없으면, 400 error을 던지고, return (가입된 사용자가 없으면)
  if (!user) return res.status(400).json({ ok: false });

  // user 정보가 있으면, token을 생성한다. payload는 token으로 생성될 6자리 임의의 수
  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  // 토큰 생성 명령 go!
  const token = await client.token.create({
    data: {
      payload,

      // token에 삽입될 user의 정보는
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

  if (phone) {
    /*  const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE!,
      body: `Your login token is ${payload}.`,
    });
    console.log(message); */
  } else if (email) {
    /* const email = await mail.send({
      from: "nico@nomadcoders.co",
      to: "nico@nomadcoders.co",
      subject: "Your Carrot Market Verification Email",
      text: `Your token is ${payload}`,
      html: `<strong>Your token is ${payload}</strong>`,
    });
    console.log(email); */
  }
  return res.json({
    ok: true,
  });
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});
