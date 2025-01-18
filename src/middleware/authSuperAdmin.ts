import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


const ADMINSECRET = process.env.SUPERADMINSECRET; // Make sure to replace this with your actual secret

export const authenticateSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);

        if (ADMINSECRET) {
            jwt.verify(token, ADMINSECRET, (err, user) => {
                if (err) {
                    console.log(err)
                    res.status(403).send("Forbidden: Invalid token");
                } else {
                    req.user = user as JwtPayload;
                    next();
                }
            });
        } else {
            res.status(500).send("Server configuration error");
        }
    } else {
        res.status(401).send("Unauthorized: No token provided or invalid format");
    }
};
