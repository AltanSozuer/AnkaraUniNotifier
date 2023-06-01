import express, { Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator';
import UserService from '../services/UserService';
import { isEmailValid } from '../utils/RegexHelpers';
import loggerFunc from '../utils/Logger';
const router = express.Router();
const logger = loggerFunc(__filename);


router.post('/register',
    body('name')
        .exists().withMessage('name must be exist').bail()
        .isString().withMessage('name must be string').bail()
        .isLength({ min: 2 }).escape(),
    body('surname')
        .exists().withMessage('surname must be exist').bail()
        .isString().withMessage('surname must be string').bail()
        .isLength({ min: 2 }).escape(),
    body('email')
        .exists().withMessage('email must be exist').bail()
        .custom(isEmailValid).withMessage('email format is invalid').bail()
        .isLength({ min: 2 }).escape(),
    body('password')
        .exists().withMessage('password must be exist').bail()
        .isString().withMessage('password must be string').bail()
        .isLength({ min: 8 }).withMessage('password length should be >= 8')
        .escape(),
    async (req: Request, res: Response ) => {
        
        logger.info('POST /register is called')
        const validationRes: Result = validationResult(req);
        logger.debug('POST /register parameter validation result: ', {
            result: validationRes
        })

        if(validationRes.isEmpty()) {
            try {
                const { name, surname, email, password }  = req.body;
                logger.debug('POST /notifications given parameters: ', { name, surname, email, password })
                const createdUser = await new UserService().create({ name, surname, email, password })
                res.status(201).json({ data: createdUser })
            }
            catch(err) {
                res.status(500).json({ error: {
                    msg: `Register is failed.`,
                    detail: err
                }})
            }
        }
        else {
            logger.error('POST /register | Parameters are not valid : ', {
                result: validationRes.array()
            })
            res.status(400).json({ error: validationRes.array() })
        }
    }    
)

export default router;