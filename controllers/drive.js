import { google } from "googleapis";
import { get } from "../config/config.js";
import { createReadStream } from "streamifier";
import { lookup } from "mime-types";

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || get("GOOGLE_CLIENT_SECRET");
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || get("GOOGLE_REDIRECT_URI");
const GOOGLE_REFRESH_TOKEN =
  process.env.GOOGLE_REFRESH_TOKEN || get("GOOGLE_REFRESH_TOKEN");
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID || get("DRIVE_FOLDER_ID");

const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oauth2client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2client,
});

const BASE_URL = "https://drive.google.com/uc";

const uploadFile = async (file) => {
  // console.log(file);
  const fileExtension = (file.originalname.match(/\.+[\S]+$/) || [])[0];
  try {
    const fileMetadata = {
      name: `${file.fieldname}-${Date.now()}${fileExtension}`,
      parents: [DRIVE_FOLDER_ID],
    };
    const response = await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: lookup(fileExtension),
        body: createReadStream(file.buffer),
      },
    });
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    return {
      id: response.data.id,
      url: `${BASE_URL}?id=${response.data.id}`,
      name: response.data.name,
    };
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

const deleteFile = async (fileId) => {
  try {
    const response = await drive.files.delete({
      fileId: fileId,
    });
    return response;
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

export default {
  uploadFile,
  deleteFile,
};
