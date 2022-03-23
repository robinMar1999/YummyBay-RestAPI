import twilio from "twilio";
import config from "../config/config.js";
import fast2sms from "fast-two-sms";
import otpGenerator from "otp-generator";
import axios from "axios";
import fetch from "node-fetch";
import sendEmail from "./sendEmail.js";

const client = twilio(config.TWILIO_SID, config.TWILIO_TOKEN);

const getMessageBody = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  const messageBody = `Your Yummybay otp is ${otp}. Please do not share it with anyone else`;
  return { messageBody, otp };
};

const useTwilio = async (number, body) => {
  const message = await client.messages.create({
    body: body,
    from: config.TWILIO_PHONE,
    to: number,
  });
  return message;
};

const useFast2Sms = async (number, messageBody) => {
  console.log(number, messageBody);
  const body = {
    sender_id: "FSTSMS",
    message: messageBody,
    route: "p",
    numbers: number,
  };
  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        authorization: config.FAST2SMS_KEY,
      },
    });
    return response;
  } catch (error) {
    console.log(error.message);
    return new Error(error.message);
  }
};

const sendOtp = async (email) => {
  const { otp, messageBody } = getMessageBody();
  // const result = await useTwilio("+91" + number, messageBody);
  const result = await sendEmail(
    "OTP for authentication",
    email,
    `Your OTP is ${otp}`
  );
  return { result, otp };
};

export default sendOtp;
