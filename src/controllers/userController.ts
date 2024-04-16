import { Request, Response } from "express";
import { User } from "../database/models/User";
import bcrypt from "bcrypt"
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({ message: "List of all users", data: users });
};

export const registerUser = async (req: Request, res: Response) => {
 try {
  if(req.body){
                     const salt=await bcrypt.genSalt(10);
                  const hashedPass=await  bcrypt.hash(req.body.password,salt);

    const newUSer= { 
      fullName:req.body.fullName,
      email:req.body.email,
      password:hashedPass
        };
                
const createUser= await User.create({...newUSer})

return res.status(201).json({
  message:'user Created',
  userName:createUser.fullName
})

  }
} catch (error) {
  res.status(500).json({ 
    message: 'Internal server error',    
   error:error
  });
  

}


};
