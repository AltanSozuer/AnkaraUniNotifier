import MongoDBService from "./MongoDBService";
import { Users } from "../models/schemas/Users";
import { UsersCreateDTO } from "../models/dto/User.dto";

class UserService {

    Schema = MongoDBService.getSchema();
    userSchema = new this.Schema(Users);
    UsersModel = MongoDBService.getMongoose().model('Users', this.userSchema);

    constructor() {
    }


    async fetchOne(email: string) {
        return this.UsersModel.findOne({ email: email});
    }


    async fetchMany() {
        //TODO: complete implementation
    }

    async create(userFields: UsersCreateDTO) {
        const userInDb = new this.UsersModel(userFields);
        await userInDb.save();

        return this.UsersModel.findOne({ email: userFields.email });
    }

    async update(email: string, newUserFields: UsersCreateDTO) {
        //TODO: complete implementation
    }

    async delete(email: string) {
        return this.UsersModel.findOneAndDelete({
            email: email
        }).exec()
    }
}


export default UserService;