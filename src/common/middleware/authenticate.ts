import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { auth } from 'firebase-admin';

interface FirebaseRequest extends Request {
    user?: auth.DecodedIdToken;
}

const authenticateUser = async (req: FirebaseRequest, res: Response, next: NextFunction) => {
    const idToken = req.headers.authorization; // idToken could be undefined

    if (!idToken) {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        req.user = await admin.auth().verifyIdToken(idToken);
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};

export { authenticateUser };
