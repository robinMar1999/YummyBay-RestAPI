const config = {
  jwtSecret: "thisisyummybay",
  databaseUrl: "mongodb://localhost:27017/yummybay",
  GOOGLE_CLIENT_ID:
    "836872238427-tj6582bo1mbjqhkqo7ei80gfl72u7k5o.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "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",
  GOOGLE_REFRESH_TOKEN:
    "1//04zU9b0r_EpIXCgYIARAAGAQSNwF-L9IrT3MDBOhmy2Yo1IN4whsklZwVuInxvYlmK-tGjTs9uSc8bmHVTvY3IH0lYBBmzlcVFIo",
  GOOGLE_REDIRECT_URI: "https://developers.google.com/oauthplayground",
  DRIVE_FOLDER_ID: "1R0vC-FbgIBfInbPB91ZGQsZIS7dOfqKf",
};

export const get = (key) => {
  return config[key];
};

export default config;
