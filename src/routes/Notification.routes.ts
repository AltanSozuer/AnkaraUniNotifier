import express, { Request, Response, NextFunction} from 'express';
import { body, Result, validationResult } from 'express-validator';
import { isStringArray ,filterNamesThatExistInFacultyList, isDateValid } from '../utils/ValidateHelpers';
import { NotificationService } from '../services/NotificationService';
import loggerFunc from '../utils/Logger';
const router = express.Router();
const logger = loggerFunc(__filename);

router.post('/notifications', 
    body('facultyList').optional().isLength({ min: 1 }).custom(isStringArray).escape(),
    body('timeUntil').optional().isString().isLength({ min: 2 }).custom(isDateValid).escape(),
    async (req: Request, res: Response, next: NextFunction) => {
    logger.info('GET /notifications is called')
    const validResult: Result = validationResult(req);
    logger.debug('GET /notifications parameter validation result: ', {
        result: validResult
    })

    if(validResult.isEmpty()) {
        const { facultyList, timeUntil } = req.body;
        logger.debug('GET /notifications given parameters: ', {
            facultyList,
            timeUntil
        })
        let validFacultyNames: string[] = [];
        if(facultyList && facultyList.length){
            validFacultyNames = filterNamesThatExistInFacultyList(facultyList);
        }
        if(facultyList?.length && !validFacultyNames.length) {
            logger.error('GET /notifications | Given faculty names are not valid : ', {
                facultyList,
                validFacultyNames
            })
            res.status(400).json({ error: {
                msg: `Given faculty names are not valid.`,
                facultyList: facultyList
            }})
        }    
        else{
            const results = await new NotificationService().byFacultyList(facultyList).byTime(timeUntil).getNotifications();
            logger.debug('GET /notifications | List of notification data will be send: ', {
                dataList: results
            })
            res.status(200).json({ data: results })
        }
    }
    else{
        logger.error('GET /notifications | Parameters are not valid : ', {
            result: validResult.array()
        })
        res.status(400).json({ errors: validResult.array() })
    }
})


export default router;

