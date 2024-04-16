import { Request, Response } from "express";
import { NextFunction }  from 'express';
import { User } from "../database/models/User";
import bcrypt from "bcrypt"
import passport from "passport";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({ message: "List of all users", data: users });
};

export const registerUser = async (req: Request, res: Response,next:NextFunction) => {
 try {
  if(req.body){   
    passport.authenticate('signup', { session: false }, (err:any, user:any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ 
          message: 'User not created'
         });
      }
  
 return res.status(201).json({
   message:'user Created'
     })
    })(req, res, next);


}} catch (error) {
  res.status(500).json({ 
    message: 'Internal server error',    
   error:error
  });

}

};
