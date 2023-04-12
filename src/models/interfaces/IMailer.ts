import { IMailOptions } from "./IMailOptions"

export interface IMailer {
    sendMail: ( opt: IMailOptions ) => Promise<void>
}