import {userValidate } from "../validations/user.valid";
import { Request, Response } from "express";
import { NextFunction }  from 'express';
import { User } from "../database/models/User";

export const userEXist =async (req: Request, res: Response,next:NextFunction) => {
  try {
    if(req.body){
        const newUSer= { 
            email:req.body.email,
            password:req.body.password
              };
       
        const userEXist= await User.findOne({where:{
          email:newUSer.email
                       }})
                       if (userEXist) {
                        return res
                          .status(409)
                          .json({ status: "confict", 
                          message: "User already exist!!" });
                      }
                  }
              next();
                   } catch (error) {
    res.status(500).json({
        error:error
    })
    }
}
export const userValid= async (req: Request, res: Response,next:NextFunction) => {
try {
    if(req.body){
        const newUSer= { 
            email:req.body.email,
            password:req.body.password
              };
            const {error}=userValidate(newUSer)
        if(error){
    return res.status(400).json({ 
        message: error.details[0].message
     });
        }
}
next();
}catch (error) {
      res.status(500).json({
        error:error
    })
}}