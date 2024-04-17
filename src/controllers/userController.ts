import { Request, Response } from "express";
import { NextFunction }  from 'express';
import { User } from "../database/models/User";
import bcrypt from "bcrypt"
import passport from "passport";
import { generateToken } from "../utils/tokens";
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({ message: "List of all users", data: users });
};
export const registerUser = async (req: Request, res: Response,next:NextFunction) => {
 try {
  if(req.body){   
    passport.authenticate('signup', { session: false }, (err:any, user:any) => {
      req.login(user,async()=>{
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(400).json({ 
            message: 'bad request'
           });
        }
        const token=generateToken(user);
        res
        .status(201)
        .header('authenticate', token)
        .json({ status: 201,
           message: 'Account Created', 
           token:token 
          });

      });
      
//  return res.status(201).json({
//    message:'user Created successfully'
//      })
    })(req, res, next);


}} catch (error) {
  res.status(500).json({ 
    message: 'Internal server error',    
   error:error
  });

}

};
