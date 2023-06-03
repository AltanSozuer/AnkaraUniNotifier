import jsonwebtoken from "jsonwebtoken";
import IToken from "../models/dto/Token.dto";
import IUser from "../models/dto/User.dto";
import TokenModel from "../models/mongo/Token";
const { 
    JWT_ACCESS_TOKEN_SECRET, 
    JWT_ACCESS_TOKEN_EXP,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXP } = process.env;

interface ITokens {
    accessToken: string;
    refreshToken: string;
}

interface CustomJwtPayload {
    _id: object;
    email: string;
}


export default class TokenService {
    constructor() {}

    async fetchOneByRefreshToken(refreshToken: string) {
        try {
            return TokenModel.findOne({refreshToken});
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    async fetchAll() {
        try {
            return TokenModel.find({}).exec();
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    async createToken(tokenFields: IToken) {
        try { 
            const tokenInDb = new TokenModel(tokenFields);
            await tokenInDb.save();
            return this.fetchOneByRefreshToken(tokenInDb.refreshToken)
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    async generateTokens(_id: object, email: string): Promise<ITokens> {
        try {
            const accessToken = jsonwebtoken.sign({_id, email}, JWT_ACCESS_TOKEN_SECRET as string, { expiresIn: JWT_ACCESS_TOKEN_EXP } );
            const refreshToken = jsonwebtoken.sign({_id, email}, JWT_REFRESH_TOKEN_SECRET as string, { expiresIn: JWT_REFRESH_TOKEN_EXP } );
           
            await this.deleteTokenByUserId(_id);
            await this.createToken({refreshToken, userId: _id, createdAt: new Date()});
            return Promise.resolve({ accessToken, refreshToken });
        }
        catch(err) {
            throw new Error(err as string);            
        }
    }

    async verifyRefreshToken(refreshToken: string): Promise<CustomJwtPayload> {
        try {
            const userRelatedTokenInDb = await this.fetchOneByRefreshToken(refreshToken);
            if(!userRelatedTokenInDb) {
                throw new Error('Invalid refresh token');
            }
            const tokenPayload = jsonwebtoken.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET as string) as CustomJwtPayload
            return tokenPayload;
        }
        catch(err) {
            throw new Error(err as string);            
        }
    }

    async deleteTokenByUserId(userId: object) {
        return TokenModel.findOneAndDelete({ userId }).exec()
    }
    
    async deleteTokenByRefreshToken(refreshToken: string) {
        return TokenModel.findOneAndDelete({ refreshToken }).exec()
    }
}

