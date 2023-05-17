import express, { Request, Response, NextFunction} from 'express';
import { body, Result, validationResult } from 'express-validator';
import { isStringArray ,isNameExistInFacultyList, isDateValid } from '../utils/ValidateHelpers';
import { NotificationService } from '../services/NotificationService';
const router = express.Router();

router.get('/notification', 
    body('facultyList').optional().custom(isStringArray).custom(isNameExistInFacultyList).escape(),
    body('timeUntil').optional().isString().isLength({ min: 2 }).custom(isDateValid).escape(),
    async (req: Request, res: Response, next: NextFunction) => {
    
    const validResult: Result = validationResult(req);
    if(validResult.isEmpty()) {
        const { facultyList, timeUntil } = req.body;
        const results = await new NotificationService().byFacultyList(facultyList).byTime(timeUntil).getNotifications();
        res.status(200).json({ data: results })
    }
    else{
        res.status(400).json({ errors: validResult.array() })
    }
})


export default router;

