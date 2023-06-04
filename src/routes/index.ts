import { Application } from "express";
import { verifyToken } from "../middleware/VerifyToken";
import NotificationRoutes from './Notification.routes';
import AuthRoutes from './Auth.routes';
import UserRoutes from './User.routes';

export default function configureAllRoutes(app: Application) {
    app.use("/", AuthRoutes);
    app.use(verifyToken)
    app.use("/", NotificationRoutes);
    app.use("/", UserRoutes);
}