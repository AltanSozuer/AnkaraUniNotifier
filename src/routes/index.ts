import { Application } from "express";
import NotificationRoutes from './Notification.routes';
import AuthRoutes from './Auth.routes'
import { verifyToken } from "../middleware/VerifyToken";

export default function configureAllRoutes(app: Application) {
    app.use("/", AuthRoutes);
    app.use(verifyToken)
    app.use("/", NotificationRoutes);
}