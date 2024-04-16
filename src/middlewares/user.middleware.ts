import { userValidate } from "../validations/user.valid";
import { NextFunction, Request, Response } from "express";
import validateLogIn from "../validations/login.validation";
import { HttpException } from "../utils/http.exception";
import { User } from "../database/models/User";

const userEXist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.body){
        const newUSer= { 
            fullName:req.body.fullName,
            email:req.body.email,
            password:req.body.password
              };
       
        const userEXist= await User.findOne({where:{
          email:newUSer.email
                       }})
                       if (userEXist) {
                        return res
                          .status(409)
                          .json(new HttpException("CONFLICT", "User already exist!!"));
                      }
                  }
              next();
                   } catch (error) {
    res.status(500).json(new HttpException("SERVER ERROR", "Something went wrong!!"));
  }
};
const userValid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body) {
      const { error } = userValidate(req.body);
      if (error) {
        return res.status(400).json(new HttpException("BAD REQUEST", error.details[0].message.replace(/\"/g, "")));
      }
    }
    next();
  } catch (error) {
    res.status(500).json(new HttpException("SERVER ERROR", "Something went wrong!!"));
  }
};

const logInValidated = (req: Request, res: Response, next: NextFunction) => {
  const error = validateLogIn(req.body);

  if (error)
    return res
      .status(400)
      .json(
        new HttpException(
          "BAD REQUEST",
          error.details[0].message.replace(/\"/g, "")
        )
      );

  next();
};

export default {
  logInValidated,
  userEXist,
  userValid,
};
