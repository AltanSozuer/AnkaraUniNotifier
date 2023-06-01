import IToken from "../models/dto/Token.dto";
import TokenModel from "../models/mongo/Token";

export default class TokenService {
    constructor() {}

    async fetchOneByRefreshToken(refreshToken: string) {
        try {
            return TokenModel.findOne({refreshToken}).select("user");
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    async createToken(tokenFields: IToken) {
        try {
            const tokenInDb = new TokenModel(tokenFields);
            await tokenInDb.save();
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}

