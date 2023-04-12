import { IAuthOptions } from "./interfaces/IAuthOptions";

export class AuthOptions {
    type: string;
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;

    constructor({
        type,
        user,
        clientId,
        clientSecret,
        refreshToken
    }: IAuthOptions) {
    
            this.type = type;
            this.user = user;
            this.clientId = clientId;
            this.clientSecret = clientSecret;
            this.refreshToken = refreshToken;
    }

    get getObjFormat() {
        return {
            type: this.type,
            user: this.user,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            refreshToken:this.refreshToken
        }
    }
}


