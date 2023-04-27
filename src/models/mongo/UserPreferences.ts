import MongoDBService from "../../services/MongoDBService";
import IUserPreferences from "../dto/UserPreferences.dto";
const Schema = MongoDBService.getSchema();

const UserPreferencesRaw = {
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    faculty_domain_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "FacultyDomain"
    },
    created_date: {
        type: Date,
        required: true,
        default: new Date()
    },
    updated_date: {
        type: Date,
        required: true,
        default: new Date()
    }
}

const userPreferencesSchema = new Schema<IUserPreferences>(UserPreferencesRaw)
const UserPreferencesModel = MongoDBService.getMongoose().models.UserPreferences || MongoDBService.getMongoose().model<IUserPreferences>('UserPreferences', userPreferencesSchema);

export default UserPreferencesModel;