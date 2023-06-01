import express, { Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator';
import UserService from '../services/UserService';
import { isEmailValid } from '../utils/RegexHelpers';
import loggerFunc from '../utils/Logger';
import { generateAccessToken, getRefreshToken, isPasswordEqualToItsHashedVersion } from '../utils/AuthHelpers';
import jwtDecode from 'jwt-decode';
import TokenService from '../services/TokenService';
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
                const userService = new UserService();
                logger.debug('POST /register given parameters: ', { name, surname, email, password })

                const checkUserAlreadyRegistered = await userService.fetchOneWithoutPassword(email);
                if(checkUserAlreadyRegistered){
                    const errDetailObj = { msg: 'User is already exist who has given email', email };
                    logger.debug('POST /register is failed parameters: ', errDetailObj)
                    return res.status(400).json({ error: errDetailObj })
                } 
                const createdUser = await userService.create({ name, surname, email, password })
                const accessToken = generateAccessToken(createdUser.email)
                const decodedAccessToken: {exp: string} = jwtDecode(accessToken);
                const expireAt = decodedAccessToken.exp;
                res.status(201).json({
                    msg: 'User registered successfully',
                    accessToken,
                    expireAt, 
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
                    return res.status(401).json({ msg: 'User does not exist' })
                }
                const isPassValid = await isPasswordEqualToItsHashedVersion(password, userInDb.password);
                if(!isPassValid) {
                    return res.status(401).json({ msg: 'Password is invalid' })
                }

                const accessToken = generateAccessToken(userInDb.email)
                const decodedAccessToken: {exp: string} = jwtDecode(accessToken);
                const expireAt = decodedAccessToken.exp;
                const refreshToken = getRefreshToken();
                await new TokenService().createToken({refreshToken, user: userInDb._id})
                res.status(200).json({
                    msg: 'Successfully logged in',
                    accessToken,
                    refreshToken,
                    expireAt
                })
            }
            catch(err) {
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
                const { refreshToken } = req.body;
                const userRelatedTokenInDb = await new TokenService().fetchOneByRefreshToken(refreshToken);
                if(!userRelatedTokenInDb) {
                    return res.status(401).json({ message: 'Invalid refresh token' })
                }
                const userInDb = await new UserService().fetchOneWithoutPassword(userRelatedTokenInDb._id);
                if(!userInDb) {
                    return res.status(401).json({ message: 'Invalid refresh token' })
                }
                const token = generateAccessToken(userInDb.email);
                return res.status(201).json({accessToken: token})
            }
            catch(err) {
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

export default router;