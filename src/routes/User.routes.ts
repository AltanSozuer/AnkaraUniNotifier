import express, { Request, Response, NextFunction} from 'express';
import UserService from '../services/UserService';
import loggerFunc from '../utils/Logger';
const router = express.Router();
const logger = loggerFunc(__filename);

/**
 * @api {get} /user Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * @apiSuccess {String} email  Email of the User.
 * @apiSuccess {String} password  Password of the User.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe",
 *       "email": "john@sample.com",
 *       "password": "samplepassword"
 *     }
 *
 * @apiError Unauthorized The email of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Authentication Error"
 *     }
 */
router.get('/user', 
    async (req: Request, res: Response, next: NextFunction) => {
    logger.info('GET /user is called')
    const email = req?.user?.email
    if(email) {
        logger.debug('GET /user | User email :, ', {email})
        const userInDb = await new UserService().fetchOneWithPassword(email);
        return res.status(200).json({data: userInDb})
    }
    else{
        logger.error('GET /user | Email is not inserted to request : ', {
            "req.user: ": req.user
        })
        res.status(401).json({ error: { msg: "Authentication Error"} })
    }
})


export default router;

