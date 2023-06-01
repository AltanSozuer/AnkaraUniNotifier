import { Application } from "express";
import NotificationRoutes from './Notification.routes';
import AuthRoutes from './Auth.routes'

export default function configureAllRoutes(app: Application) {
    app.use("/", NotificationRoutes);
    app.use("/", AuthRoutes);
}