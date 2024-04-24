import { string } from "joi";
import { responses } from "../responses";

const roles = {
  "/roles": {
    post: {
      tags: ["Role"],
      security: [{ JWT: [] }],
      summary: "Create Role",
      parameters: [
        {
          in: "body",
          name: "request body",
          required: true,
          schema: {
            type: "object",
            properties: {
             
              roleName: {
                type: "string",
                example: "SELLER",
              },
              permission: {
                type: "string",
                example: "Add product to  stock",
              },
            },
          },
        },
      ],
      consumes: ["application/json"],
      responses,
    },
  },
  "/users/:userId/role": {
    post: {
      tags: ["Role"],
      security: [{ JWT: [] }],
      summary: "Assign role user",
      parameters: [
        {
          in: "body",
          name: "request body",
          required: true,
          schema: {
            type: "object",
            properties: {
              roleId: {
                type: "string",
                example: "083a197e-ac11-4c62-b190-dad7b05954e",
              },
           
            },
          },
        },
      ],
      consumes: ["application/json"],
      responses,
    },
  },
  "/roles/:id": {
    patch: {
      tags: ["Role"],
      security: [{ JWT: [] }],
      summary: "Edit Role",
      parameters: [
      
        {
          in: "body",          
          name: "request body",
          required: true,
          schema: {
            type: "object",
            properties: {
             
              roleName: {
                type: "string",
                example: "SELLER",
              },
              permission: {
                type: "string",
                example: "Add product to  stock",
              },
            },
          },
        },
      ],
      
      consumes: ["application/json"],
      responses,
    },
    delete: {
        tags: ["Role"],
        security: [{ JWT: [] }],
        summary: "delete Role",
        parameters: [
          {
            name:"id",
            in:"path",
            schema:{
                type:"string"
            },
            required:true
          },
        ],
        consumes: ["application/json"],
        responses,
      },
  },
  
};

export default roles;
