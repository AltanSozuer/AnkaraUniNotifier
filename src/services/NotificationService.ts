import { isStringArray, isNameExistInFacultyList, isDateValid } from "../utils/ValidateHelpers";
import NotificationModel from "../models/mongo/LastNotifications";
import INotification from "../models/dto/Notification.dto";
import MongoDBService from "./MongoDBService";

export class NotificationService {
    private filterObj: any = {}
    constructor() {}

    byFacultyList( facultyList: string[] ) {
        if(isStringArray(facultyList)){
            const validFacultyNames = facultyList.filter( name => isNameExistInFacultyList(name));
            this.filterObj["from"] = { $in: validFacultyNames }
        }
        return this;
    }

    byTime( timeUntil: string ) {
        if(isDateValid(timeUntil)) {
            this.filterObj["date"] = { $gt: new Date(timeUntil) }
        }
        return this;
    }

    resetFilters() {
        this.filterObj = {};
    }

    async createNotifications( notificationFields: INotification[]) {
        return NotificationModel.insertMany(notificationFields)
    }

    async getLastNotification() {
        return NotificationModel.find().limit(1).sort({ $natural: -1 }).exec();
    }

    async getLatestNotificationByDate() {
        return NotificationModel.find().limit(1).sort({ date: -1 }).exec();
    }

    async getNotifications() {
        const results = await NotificationModel.find(this.filterObj).exec();
        this.resetFilters();
        return results;
    }

    async updateLastNotification(oldNotifISODate: Date , newNotificationFields: INotification) {
        try{
            const updatedNotification = await NotificationModel.findOneAndUpdate(
                { date: oldNotifISODate },
                { $set: newNotificationFields },
                { new: true }
            ).exec();
    
            return updatedNotification;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

}