import { isStringArray, filterNamesThatExistInFacultyList, isDateValid } from "../utils/ValidateHelpers";
import NotificationModel from "../models/mongo/LastNotifications";
import INotification from "../models/dto/Notification.dto";
import MongoDBService from "./MongoDBService";
import loggerFunc from "../utils/Logger";
const logger = loggerFunc(__filename)
export class NotificationService {
    private filterObj: any = {}
    constructor() {}

    byFacultyList( facultyList: string[] ) {
        if(isStringArray(facultyList)){
            const validFacultyNames = filterNamesThatExistInFacultyList(facultyList);
            if(validFacultyNames.length){
                this.filterObj["from"] = { $in: validFacultyNames }
            }
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
        logger.debug('NotificationService.createNotification() is started with given param: ', {
            notificationFields
        })
        try{
            const result = await NotificationModel.insertMany(notificationFields);
            logger.debug('NotificationService.createNotification() result: ', { result })
        }
        catch(err) {
            logger.error('NotificationService.createNotification() is failed. Error: ', { error: err })
            throw new Error('NotificationService.createNotification() is failed')
        }
    }

    async getLastNotification() {
        return NotificationModel.find().limit(1).sort({ $natural: -1 }).exec();
    }

    async getLatestNotificationByDate(from : string) {
        return NotificationModel.find({ from }).limit(1).sort({ date: -1 }).exec();
    }

    async getNotifications() {
        try{
            const results = await NotificationModel.find(this.filterObj).exec();
            this.resetFilters();
            return results;
        }
        catch(err) { 
            throw new Error('getNotification is failed')
        }
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