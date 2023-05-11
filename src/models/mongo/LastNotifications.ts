import MongoDBService from "../../services/MongoDBService";
import INotification from "../dto/Notification.dto"; 
const Schema = MongoDBService.getSchema();

const NotificationRaw = {
    date: {
        type: Date,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    }
}

const notificationSchema = new Schema<INotification>(NotificationRaw)
const NotificationModel = MongoDBService.getMongoose().models.Notifications || MongoDBService.getMongoose().model<INotification>('Notifications', notificationSchema);

export default NotificationModel;