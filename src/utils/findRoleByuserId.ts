import { UUID } from "crypto";
 import { userRole } from "../database/models/userroles";
 import { userRoleModelAttributes } from "../database/models/userroles";

export const findroleName=async(id:UUID)=>{
    const role= await userRole.findOne({where:{
        userId:id
    }})
    if (role) {
         const roleidAttributes: userRoleModelAttributes = role as unknown as userRoleModelAttributes;
         return roleidAttributes.roleName;
}
}