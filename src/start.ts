import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const { PORT, MAIL_SENDER } = process.env;
import {GMailService} from './services/GmailService.js';
import { IMailOptions } from './models/interfaces/IMailOptions.js';
import RssService from './services/RssService.js';

app.listen( PORT, async () => {
    const gmailService = new GMailService();

    const insta = new RssService();
    const results = await insta.parseURL();
    if(results.length > 0) {
        const mailOptions: IMailOptions = {
            from: String(MAIL_SENDER),
            to: "sozueraltan@gmail.com",
            subject: "Ankara Üniversitesi Bilgisayar Mühendisliği Duyuru " + new Date(results[0].isoDate).toString().split('GMT')[0],
            description: results[0].title,
            text: results[0].content
        };
        await gmailService.sendMail(mailOptions)
    }
    else{
        console.log('Rss result is empty array. Result: ',results);
        
    }

    console.log("listening on port " + process.env.PORT);
})

app.get('/', (req , res) => {
    console.log("Welcome to Gmail API with Nodejs");
})