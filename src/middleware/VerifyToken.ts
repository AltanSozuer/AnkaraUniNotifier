import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
const { JWT_ACCESS_TOKEN_SECRET } = process.env;

function verifyRefreshBodyField(req: Request, res: Response, next: NextFunction) {
    if(req.body && req.body.refreshToken) {
        return next();
    }
    else { 
        return res.status(400).json({ error: 'Refresh token is missing in body field' })
    }
} 


function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) {
        return res.status(401).json({ msg: 'Authentication invalid' })
    }

    jsonwebtoken.verify(token as string, JWT_ACCESS_TOKEN_SECRET as string, (err, decodedPayload) => {
        if(err) {
            return res.status(403).json({ msg: 'Authentication invalid' })
        }
        res.locals.user = decodedPayload;
        next();
    })
}


export {
    verifyToken,
    verifyRefreshBodyField
}