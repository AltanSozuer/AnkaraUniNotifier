import express, { Request, Response, NextFunction} from 'express';
import { body, Result, validationResult } from 'express-validator';
import { isStringArray ,filterNamesThatExistInFacultyList, isDateValid } from '../utils/ValidateHelpers';
import { NotificationService } from '../services/NotificationService';
const router = express.Router();

router.get('/notifications', 
    body('facultyList').optional().isLength({ min: 1 }).custom(isStringArray).escape(),
    body('timeUntil').optional().isString().isLength({ min: 2 }).custom(isDateValid).escape(),
    async (req: Request, res: Response, next: NextFunction) => {
    
    const validResult: Result = validationResult(req);
    console.log('validResult: ',validResult.array());

    if(validResult.isEmpty()) {
        const { facultyList, timeUntil } = req.body;
        let validFacultyNames: string[] = [];
        if(facultyList && facultyList.length){
            validFacultyNames = filterNamesThatExistInFacultyList(facultyList);
        }
        if(facultyList?.length && !validFacultyNames.length) {
            res.status(400).json({ error: {
                msg: `Give faculty names are not valid.`,
                facultyList: facultyList
            }})
        }    
        else{
            const results = await new NotificationService().byFacultyList(facultyList).byTime(timeUntil).getNotifications();
            res.status(200).json({ data: results })
        }
    }
    else{
        res.status(400).json({ errors: validResult.array() })
    }
})


export default router;

