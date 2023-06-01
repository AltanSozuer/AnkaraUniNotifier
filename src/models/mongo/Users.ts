import MongoDBService from "../../services/MongoDBService"
import IUser from "../dto/User.dto";
const Schema = MongoDBService.getSchema();

const UserRaw = {
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}

const userSchema = new Schema<IUser>(UserRaw);
const UsersModel = MongoDBService.getMongoose().models.Users || MongoDBService.getMongoose().model<IUser>('Users', userSchema);

export default UsersModel;