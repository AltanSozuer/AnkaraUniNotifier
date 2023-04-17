
import { LastNotifications } from "../models/schemas/LastNotifications";
import { NotificationCreateDTO } from "../models/dto/Notification.dto";
import MongoDBService from "./MongoDBService";

export class NotificationService {
    

    //? move following 3 lines to another file because as notification service objects are created, so following lines are repeated  
    Schema = MongoDBService.getSchema();
    notificationSchema = new this.Schema(LastNotifications)
    NotificationModel = MongoDBService.getMongoose().model('Notifications', this.notificationSchema);

    constructor() {

    }

    async createNotification( notificationFields: NotificationCreateDTO) {
        const notification = new this.NotificationModel(notificationFields)
        await notification.save();
        return this.NotificationModel.findOne({ date: notificationFields.date })
    }

    async getLastNotification() {
        return this.NotificationModel.find().limit(1).sort({ $natural: -1 }).exec();
    }


    async updateLastNotification(oldNotifISODate: string , newNotificationFields: NotificationCreateDTO) {
        const oldNotification = await this.NotificationModel.findOneAndUpdate(
            { date: oldNotifISODate },
            { $set: newNotificationFields },
            { new: true }
        ).exec();

        return oldNotification;
    }

}