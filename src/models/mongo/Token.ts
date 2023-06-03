import MongoDBService from "../../services/MongoDBService"
import IToken from "../dto/Token.dto";
const Schema = MongoDBService.getSchema();

const TokenRaw = {
    refreshToken: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 * 30
    }
}

const tokenSchema = new Schema<IToken>(TokenRaw);
const TokenModel = MongoDBService.getMongoose().models.Token || MongoDBService.getMongoose().model<IToken>('Token', tokenSchema);

export default TokenModel;