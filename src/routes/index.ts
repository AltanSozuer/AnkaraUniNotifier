import { Application } from "express";
import NotificationRoutes from './Notification.routes';
import UserRoutes from './User.routes'

export default function configureAllRoutes(app: Application) {
    app.use("/", NotificationRoutes);
    app.use("/", UserRoutes);
}