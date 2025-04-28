import { google } from 'googleapis';
import config from '../config/config.js';
import userModel from '../models/user.model.js';



async function getGooGleAuth(userid) {

    const user = await userModel.findById(userid);

    const oAuth2Client = new google.auth.OAuth2(
        config.GOOGLE_CLIENT_ID,
        config.GOOGLE_CLIENT_SECRET,
        config.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: user.decryptGoogleRefreshToken() });
    return oAuth2Client;

}


export async function sendEmail(userId, to, subject, message) {


    const auth = await getGooGleAuth(userId);
    const gmail = google.gmail({ version: 'v1', auth });

    const email = [
        `To: ${to}`,
        "Content-Type: text/plain; charset=utf-8",
        "MIME-Version: 1.0",
        `Subject: ${subject}`,
        '',
        message,
    ].join('\n');

    const base64EncodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    return gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: base64EncodedEmail,
        },
    });


}