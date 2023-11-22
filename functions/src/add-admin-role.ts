import {auth, db } from "./init";

import express = require("express");
import * as functions from "firebase-functions";
import {getUserCredentialsMiddleware} from "./auth.middleware";

import bodyParser = require("body-parser");
import cors = require("cors");


export const addAdminRoleToUser = express();

addAdminRoleToUser.use(bodyParser.json());
addAdminRoleToUser.use(cors({origin: true}));
addAdminRoleToUser.use(getUserCredentialsMiddleware);

addAdminRoleToUser.post("/", async (req, res) => {
  functions.logger.debug("Calling adding admin role function.");

  try {
    if (!(req["uid"] && req["admin"])) {
      const message = "Denied access to user creation service.";
      functions.logger.debug(message);
      res.status(403).json({message});
      return;
    }
  
    const msg = {
        email: req.body.email,
        password: req.body.name,
        role: req.body.message,
      };
    
    msg.email = 'cassandra_harada@gmail.com';
    msg.password = '1628888'
   
    const user = await auth.createUser({
        email: msg.email ,
        password : msg.password}
    );

    functions.logger.log('User id :', user.uid);

    await auth.setCustomUserClaims(user.uid, { admin: true});
   
    db.doc(`/users/${user.uid}`).set({role: 'Admin user'});
  
    res.status(200).json({message: "admin set sucessfully role set to admin successfully."});
  } catch (err) {
    functions.logger.error("Could not create user.", err);
    res.status(500).json({message: "Could not create user."});
  }
});