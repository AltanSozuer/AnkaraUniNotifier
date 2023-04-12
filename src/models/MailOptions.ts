import { IMailOptions } from "./interfaces/IMailOptions";

export class MailOptions {
    from: string;
    to: string;
    subject: string;
    description: string;
    text: string;

    constructor ({
        from,
        to,
        subject,
        description,
        text
    } : IMailOptions) {
    
            this.from = from;
            this.to = to;
            this.subject = subject;
            this.description = description;
            this.text = text;
    }

    get objectFormat() {
        return {
            from: this.from,
            to: this.to,
            subject: this.subject,
            description: this.description,
            text: this.text
        }
    }
}