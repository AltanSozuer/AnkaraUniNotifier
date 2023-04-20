import MongoDBService from "../../services/MongoDBService";
import IFacultyDomain from "../dto/FacultyDomains.dto";

const Schema = MongoDBService.getSchema();

const FacultyDomainRaw = {
    name: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    }
}

const facultyDomainSchema = new Schema<IFacultyDomain>(FacultyDomainRaw)
const FacultyDomainModel = MongoDBService.getMongoose().models.FacultyDomain || MongoDBService.getMongoose().model<IFacultyDomain>('FacultyDomain', facultyDomainSchema);

export default FacultyDomainModel;