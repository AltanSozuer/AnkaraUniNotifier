import { Application } from "express";
import NotificationRoutes from './Notification.routes';


export default function configureAllRoutes(app: Application) {
    app.use("/", NotificationRoutes);
}