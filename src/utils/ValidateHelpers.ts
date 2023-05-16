import { facultyNameList } from "../constants/FacultyDomains";

function isNameExistInFacultyList(candidateName: string): boolean {
    return facultyNameList.some( fac => fac === candidateName);
}

function isStringArray( candidateParam: any ): boolean {
    return Array.isArray(candidateParam) 
    ? candidateParam.every(_ => typeof _ === "string") 
    : false;
}



export {
    isNameExistInFacultyList,
    isStringArray
}

