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
    body('searchText').optional().isString().escape(),
    async (req: Request, res: Response, next: NextFunction) => {
    logger.info('POST /notifications is called')
    const validResult: Result = validationResult(req);
    logger.debug('POST /notifications parameter validation result: ', {
        result: validResult
    })

    if(validResult.isEmpty()) {

        const { facultyList, timeUntil, searchText } = req.body;
        
        logger.debug('POST /notifications given parameters: ', {
            facultyList,
            timeUntil,
            searchText
        })
        let validFacultyNames: string[] = [];
        if(facultyList && facultyList.length){
            validFacultyNames = filterNamesThatExistInFacultyList(facultyList);
        }
        if(facultyList?.length && !validFacultyNames.length) {
            logger.error('POST /notifications | Given faculty names are not valid : ', {
                facultyList,
                validFacultyNames
            })
            res.status(400).json({ error: {
                msg: `Given faculty names are not valid.`,
                facultyList: facultyList
            }})
        }    
        else{
            const results = await new NotificationService().byFacultyList(facultyList).byTime(timeUntil).byText(searchText).getNotifications();
            logger.debug('POST /notifications | List of notification data will be send: ', {
                dataList: results
            })
            res.status(200).json({ data: results })
        }
    }
    else{
        logger.error('POST /notifications | Parameters are not valid : ', {
            result: validResult.array()
        })
        res.status(400).json({ error: validResult.array() })
    }
})


export default router;

