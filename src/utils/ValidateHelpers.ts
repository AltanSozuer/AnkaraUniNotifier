import dayjs from "dayjs";
import { facultyNameList } from "../constants/FacultyDomains";


function isDateValid(candidateDate: string): boolean {
    return dayjs(candidateDate).isValid();
}

function isDateAfterThanOther(firstDate: string, secondDate: string): boolean {
    if(isDateValid(firstDate) && isDateValid(secondDate)) {
        return dayjs(firstDate).isAfter(dayjs(secondDate));
    }
    return false;
}

function isDateBeforeThanOther(firstDate: string, secondDate: string): boolean {
    return (isDateValid(firstDate) && isDateValid(secondDate))
        ? dayjs(firstDate).isBefore(dayjs(secondDate))
        : false;
}


function isNameExistInFacultyList(candidateName: string): boolean {
    return facultyNameList.some( fac => fac === candidateName);
}

function isStringArray( candidateParam: any ): boolean {
    return (Array.isArray(candidateParam) && candidateParam.length) 
    ? candidateParam.every(_ => typeof _ === "string") 
    : false;
}



export {
    isDateAfterThanOther,
    isDateBeforeThanOther,
    isNameExistInFacultyList,
    isStringArray,
    isDateValid
}

