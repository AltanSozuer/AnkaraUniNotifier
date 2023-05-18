import dayjs from "dayjs";
import { facultyNameList } from "../constants/FacultyDomains";


function isDateValid(candidateDate: string): boolean {
    return (typeof candidateDate === 'string' && candidateDate.trim().length)
        ? dayjs(candidateDate).isValid()
        : false;
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


function areNamesExistInFacultyList(candidateNameList: string[]): boolean {
    return candidateNameList.some( fac => facultyNameList.some( fc => fc === fac));
}

function filterNamesThatExistInFacultyList(candidateNameList: string[]): string[] {
    return candidateNameList.filter( candName => facultyNameList.some( fac => fac === candName))
}

function isStringArray( candidateParam: any ): boolean {
    return (Array.isArray(candidateParam) && candidateParam.length) 
    ? candidateParam.every(_ => typeof _ === "string") 
    : false;
}

function serializeDateInJSON(key: string, value: string): Date | string {
    return (key === 'date') ? new Date(value) : value;
}

export {
    isDateAfterThanOther,
    isDateBeforeThanOther,
    areNamesExistInFacultyList,
    filterNamesThatExistInFacultyList,
    isStringArray,
    isDateValid,
    serializeDateInJSON
}

