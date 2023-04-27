import FacultyDomainModel from "../../models/mongo/FacultyDomains"
import { FACULTY_DOMAINS } from "../../constants/FacultyDomains"

const seedDB = async () : Promise<void> => {
    await FacultyDomainModel.deleteMany({});
    await FacultyDomainModel.insertMany(FACULTY_DOMAINS);
}


export { seedDB };