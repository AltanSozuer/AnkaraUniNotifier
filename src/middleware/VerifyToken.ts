import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import loggerFunc from "../utils/Logger";
const { JWT_ACCESS_TOKEN_SECRET } = process.env;
const logger = loggerFunc(__filename);

function verifyRefreshBodyField(req: Request, res: Response, next: NextFunction) {
    if(req.body && req.body.refreshToken) {
        return next();
    }
    else { 
        return res.status(400).json({ error: 'Refresh token is missing in body field' })
    }
} 


function verifyToken(req: Request, res: Response, next: NextFunction) {
    logger.info('verifyToken() is called.')
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) {
        logger.debug('verifyToken() | token in header is null', { token })
        return res.status(401).json({ msg: 'Authentication invalid' })
    }
    logger.debug('verifyToken() | token is given in header ', { token })
    jsonwebtoken.verify(token as string, JWT_ACCESS_TOKEN_SECRET as string, (err, decodedPayload) => {
        if(err) {
            return res.status(403).json({ msg: 'Authentication invalid' })
        }
        logger.debug('verifyToken() | Given token is verified with is secret ')
        req.user = decodedPayload as {_id?: object, email?: string } ;
        next();
    })
}


export {
    verifyToken,
    verifyRefreshBodyField
}