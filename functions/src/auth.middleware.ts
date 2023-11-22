/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import {auth} from "./init";

export function getUserCredentialsMiddleware(req, res, next) {
  functions.logger.debug("Attempting user credentials from request.");

  const jwt = req.headers.authorization;


  if (jwt) {
    auth.verifyIdToken(jwt)
        .then((jwtPayload) => {
          req["uid"] = jwtPayload.uid;
          req["admin"] = jwtPayload.admin;

          functions.logger.debug(
              `Credentials: uid=${jwtPayload.uid}, admin=${jwtPayload.admin}`);

          next();
        })
        .catch((err) => {
          console.debug("Error ocurred while validating JWT", err);
          next();
        });
  } else {
    next();
  }
}
