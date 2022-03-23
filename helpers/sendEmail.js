import { google } from "googleapis";
import config from "../config/config.js";

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || config.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || config.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || config.GOOGLE_REDIRECT_URI;
const GOOGLE_REFRESH_TOKEN =
  process.env.GOOGLE_REFRESH_TOKEN || config.GOOGLE_REFRESH_TOKEN;

const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oauth2client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const gmail = google.gmail({
  version: "v1",
  auth: oauth2client,
});

const sendEmail = async (subject, email, content) => {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageParts = [
    "From: YummyBay <kashyap.rocky.9277@gmail.com>",
    `To: Robin Kashyap <${email}>`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${utf8Subject}`,
    "",
    content,
  ];
  const message = messageParts.join("\n");

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
  console.log(res.data);
};

export default sendEmail;
