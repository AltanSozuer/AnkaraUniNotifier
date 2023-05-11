
import NotificationModel from "../models/mongo/LastNotifications";
import INotification from "../models/dto/Notification.dto";
import MongoDBService from "./MongoDBService";

export class NotificationService {
    constructor() {}

    async createNotifications( notificationFields: INotification[]) {
        return NotificationModel.insertMany(notificationFields)
    }

    async getLastNotification() {
        return NotificationModel.find().limit(1).sort({ $natural: -1 }).exec();
    }

    async getLatestNotificationByDate() {
        return NotificationModel.find().limit(1).sort({ date: -1 }).exec();
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