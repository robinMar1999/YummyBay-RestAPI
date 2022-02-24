import twilio from "twilio";
import config from "../config/config.js";
import fast2sms from "fast-two-sms";
import otpGenerator from "otp-generator";

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

const useFast2Sms = async (number, body) => {
  const options = {
    authorization: config.FAST2SMS_KEY,
    message: body,
    numbers: [number],
  };
  const response = await fast2sms.sendMessage(options);
  return response;
};

const sendOtp = async (number) => {
  const { otp, messageBody } = getMessageBody();
  const result = await useFast2Sms(number, messageBody);
  return { result, otp };
};

export default sendOtp;
