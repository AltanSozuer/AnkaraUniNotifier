import { google } from "googleapis";
import nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { IMailOptions } from "../models/interfaces/IMailOptions";
import { IMailer } from "../models/interfaces/IMailer";
import { IAuthOptions } from "../models/interfaces/IAuthOptions";

const {
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI,
    GMAIL_REFRESH_TOKEN,
    GMAIL_AUTH_TYPE,
    MAIL_ADDRESS
} = process.env;

export class GMailService implements IMailer {

    mailClient?: any;
    authOptions: IAuthOptions;

    constructor() {
        this.mailClient = new google.auth.OAuth2(
            GMAIL_CLIENT_ID,
            GMAIL_CLIENT_SECRET,
            GMAIL_REDIRECT_URI
        )

        this.mailClient.setCredentials({
            refresh_token: GMAIL_REFRESH_TOKEN
        })
        this.authOptions = {
            type: String(GMAIL_AUTH_TYPE),
            user: String(MAIL_ADDRESS),
            clientId: String(GMAIL_CLIENT_ID),
            clientSecret: String(GMAIL_CLIENT_SECRET),
            refreshToken:String(GMAIL_REFRESH_TOKEN)
        }
    }

    async sendMail( mailOptions: IMailOptions ) {
        try {
            const accessToken = await this.mailClient.getAccessToken();
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    ...this.authOptions,
                    accessToken: String(accessToken)
                }
            } as SMTPTransport.Options)

            const result = await transporter.sendMail(mailOptions);
            console.log('result: ',result)
        }
        catch(err) {
            console.log('Error: GmailService.sendMail is failed :D', err );
        }
    }
}
