import { Request, Response, NextFunction } from 'express';
import { auth } from './auth';

export function getUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwt = req.headers.authorization;

  if (jwt) {
    auth
      .verifyIdToken(jwt)
      .then((jwtPayload: { uid: any }) => {
        req['uid'] = jwtPayload.uid;
        next();
      })
      .catch((error: any) => {
        const message = 'Error verifying the user Id token';
        // console.log(message, error);
        res.status(403).json({ message });
      });
  } else {
    next();
  }
}
