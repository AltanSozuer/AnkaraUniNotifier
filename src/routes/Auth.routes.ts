import express, { Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator';
import UserService from '../services/UserService';
import { isEmailValid } from '../utils/RegexHelpers';
import loggerFunc from '../utils/Logger';
import { hashPassword, isPasswordEqualToItsHashedVersion } from '../utils/AuthHelpers';
import TokenService from '../services/TokenService';
const router = express.Router();
const logger = loggerFunc(__filename);

/**
 * @api {post} /register Request Register
 * @apiBody {String} name Faculty list of related notifications.
 * @apiBody {String} surname Faculty list of related notifications.
 * @apiBody {String} email Faculty list of related notifications.
 * @apiBody {String} password Faculty list of related notifications.
 * 
 * @apiGroup Auth
 *
 * @apiSuccess {Object} user User data in db.
 * @apiSuccess {String} user._id  id of the User data.
 * @apiSuccess {String} user.name  name property of the User data.
 * @apiSuccess {String} user.surname  surname of the User data.
 * @apiSuccess {String} user.email  email of the User data.
 * @apiSuccess {String} user.password  password of the User data.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "John",
 *       "surname": "Doe",
 *       "email": "john@sample.com"
 *       "surname": "samplepassword"
 *     }
 *
 * @apiError Bad Request Given params are not valid.
 * @apiError Bad Request User is already exist.
 * @apiError Internal Server Error Registration is failed.
 *
 */
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
                const userService = new UserService();
                logger.debug('POST /register given parameters: ', { name, surname, email, password })
                const hashedPassword = await hashPassword(password);
                const checkUserAlreadyRegistered = await userService.fetchOneWithoutPassword(email);
                if(checkUserAlreadyRegistered){
                    const errDetailObj = { msg: 'User is already exist who has given email', email };
                    logger.debug('POST /register is failed parameters: ', errDetailObj)
                    return res.status(400).json({ error: errDetailObj })
                } 
                const createdUser = await userService.create({ name, surname, email, password: hashedPassword })
                
                res.status(201).json({
                    msg: 'User registered successfully',
                    data: createdUser 
                })
            }
            catch(err) {
                res.status(500).json({ error: {
                    msg: `/register is failed.`,
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


/**
 * @api {post} /login Request Login
 * @apiBody {String} email Faculty list of related notifications.
 * @apiBody {String} password Faculty list of related notifications.
 * 
 * @apiGroup Auth
 *
 * @apiSuccess {Object} data 
 * @apiSuccess {String} data.accessToken  accessToken of the user.
 * @apiSuccess {String} data.refreshToken  refreshToken of the user.
 * 
 *
 * @apiError Bad Request Given params are not valid.
 * @apiError Bad Request Invalid email or password.
 * @apiError Internal Server Error Login is failed.
 *
 */

router.post('/login',
    body('email')
        .exists().withMessage('email must be exist').bail()
        .custom(isEmailValid).withMessage('email format is invalid').bail()
        .isLength({ min: 2 }).escape(),
    body('password')
        .exists().withMessage('password must be exist').bail()
        .isString().withMessage('password must be string').bail()
        .isLength({ min: 8 }).withMessage('password length should be >= 8')
        .escape(),
    async (req: Request, res: Response) => {
        logger.info('POST /login is called')
        const validationRes: Result = validationResult(req);
        logger.debug('POST /login parameter validation result: ', {
            result: validationRes
        })

        if(validationRes.isEmpty()) {
            try {
                const { email, password } = req.body;
                const userInDb = await new UserService().fetchOneWithPassword(email);
                if(!userInDb) {
                    return res.status(401).json({ msg: 'Invalid email or password' })
                }
                const isPassValid = await isPasswordEqualToItsHashedVersion(password, userInDb.password);
                if(!isPassValid) {
                    logger.debug('POST /login | Given password is not valid:  ', { isPassValid })
                    return res.status(401).json({ msg: 'Invalid email or password' })
                }

                const { accessToken, refreshToken } = await new TokenService().generateTokens(userInDb._id, userInDb.email);
        
                res.status(200).json({
                    msg: 'Successfully logged in',
                    accessToken,
                    refreshToken,
                })
            }
            catch(err) {
                logger.debug('POST /login is failed: ', { result: err })
                res.status(500).json({ 
                    error: {
                        msg: `/login is failed.`,
                        detail: err 
                    }
                })
            }
        }
        else {
            logger.error('POST /login | Parameters are not valid : ', {
                result: validationRes.array()
            })
            res.status(400).json({ error: validationRes.array() })
        }
})


/**
 * @api {post} /auth/refreshToken Request accessToken
 * @apiBody {String} refreshToken refreshToken of related user.
 * 
 * @apiGroup Auth
 *
 * @apiSuccess {Object} data 
 * @apiSuccess {String} data.accessToken  accessToken of the user.
 * 
 *
 * @apiError Bad Request Given refreshToken is not valid.
 * @apiError Bad Request refreshToken is not given.
 * @apiError Internal Server Error Request refreshToken is failed.
 *
 */
router.post('/auth/refreshToken',
    body('refreshToken').exists().withMessage('refreshToken must be exist').bail().escape(),
    async (req: Request, res: Response) => {
        logger.info('POST /auth/refreshToken is called')
        const validationRes: Result = validationResult(req);
        logger.debug('POST /auth/refreshToken parameter validation result: ', {
            result: validationRes
        })
        if(validationRes.isEmpty()) {
            try {
                const tokenService = new TokenService();
                const { refreshToken } = req.body;
                const resultOfVerification = await tokenService.verifyRefreshToken(refreshToken);
                if(!resultOfVerification) {
                    logger.debug('POST /auth/refreshToken | Refresh token verification is failed: ', { resultOfVerification })
                    return res.status(401).json({ message: 'Invalid refresh token' })
                }
                
                const userInDb = await new UserService().fetchOneWithoutPassword(resultOfVerification.email);
                if(!userInDb) {
                    logger.debug('POST /auth/refreshToken | User could not be found: ', { userInDb })
                    return res.status(401).json({ message: 'Invalid refresh token' })
                }
                const { accessToken } = await tokenService.generateTokens(userInDb._id ,userInDb.email);
                return res.status(201).json({accessToken})
            }
            catch(err) {
                logger.debug('POST /auth/refreshToken is failed: ', { error: err })
                res.status(500).json({ 
                    error: {
                        msg: `Could not refresh token.`,
                        detail: err 
                    }
                })
            }
        }
        else {
            logger.error('POST /auth/refreshToken | Parameters are not valid : ', {
                result: validationRes.array()
            })
            res.status(400).json({ error: validationRes.array() })
        }
})

/**
 * @api {delete} /logout Request logout
 * @apiBody {String} refreshToken refreshToken of related user.
 * 
 * @apiGroup Auth
 *
 * @apiSuccess {Object} data 
 * @apiSuccess {String} data.message  Success.
 * 
 *
 * @apiError Bad Request Given refreshToken is not valid.
 * @apiError Bad Request refreshToken is not given.
 * @apiError Internal Server Error Logout is failed.
 *
 */
router.delete('/logout',
    body('refreshToken').exists().withMessage('refreshToken must be exist').bail().escape(),
    async (req: Request, res: Response) => {
        logger.info('DELETE /auth/refreshToken is called')
        const validationRes: Result = validationResult(req);
        logger.debug('DELETE /auth/refreshToken parameter validation result: ', {
            result: validationRes
        })
        if(validationRes.isEmpty()) {
            try {
                const tokenService = new TokenService();
                const { refreshToken } = req.body;
                await tokenService.deleteTokenByRefreshToken(refreshToken);
                logger.debug('DELETE /auth/refreshToken | Refresh token is not exist in db so logged out: ')
                return res.status(200).json({ message: 'Successfully logged out.' });
            }
            catch(err) {
                logger.debug('DELETE /auth/refreshToken is failed: ', { error: err })
                res.status(500).json({ 
                    error: {
                        msg: `Could not refresh token.`,
                        detail: err 
                    }
                })
            }
        }
        else {
            logger.error('DELETE /logout | Parameters are not valid : ', {
                result: validationRes.array()
            })
            res.status(400).json({ error: validationRes.array() })
        }
})

export default router;