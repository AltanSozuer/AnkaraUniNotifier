import MongoDBService from "./MongoDBService";
import UsersModel from "../models/mongo/Users";
import IUser from "../models/dto/User.dto";

class UserService {

    
    constructor() {
    }

    async fetchOne(email?: string) {
        let query = email ? { email: email } : {}
        return UsersModel.findOne(query);
    }


    async fetchMany() {
        //! Complete here according to given preferences
        return UsersModel.find({})
    }

    async create(userFields: IUser) {
        try{
            const userInDb = new UsersModel(userFields);
            await userInDb.save();

            return this.fetchOne(userFields.email );
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    async update(email: string, newUserFields: IUser) {
        try{
            const updatedUserInfo = await UsersModel.findOneAndUpdate(
                {email: email},
                { $set: newUserFields},
                {new: true}
            ).exec();
            return updatedUserInfo;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    async delete(email: string) {
        return UsersModel.findOneAndDelete({
            email: email
        }).exec()
    }
}


export default UserService;