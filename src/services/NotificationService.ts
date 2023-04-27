
import NotificationModel from "../models/mongo/LastNotifications";
import INotification from "../models/dto/Notification.dto";
import MongoDBService from "./MongoDBService";

export class NotificationService {
    constructor() {}

    async createNotification( notificationFields: INotification) {
        const notification = new NotificationModel(notificationFields)
        await notification.save();
        return NotificationModel.findOne({ date: notificationFields.date })
    }

    async getLastNotification() {
        return NotificationModel.find().limit(1).sort({ $natural: -1 }).exec();
    }


    async updateLastNotification(oldNotifISODate: string , newNotificationFields: INotification) {
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