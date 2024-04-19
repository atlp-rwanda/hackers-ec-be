import { string } from "joi";
import { responses } from "../responses";

const users = {
  "/users/register": {
    post: {
      tags: ["User"],
      security: [{ JWT: [] }],
      summary: "Register user",
      parameters: [
        {
          in: "body",
          name: "request body",
          required: true,
          schema: {
            type: "object",
            properties: {
             
              email:{
                type:string,
              example: "email@example.com",
            },
            userName: {
                type: "string",
                example: "kalake250",
              },
              firstName: {
                type: "string",
                example: "kalake",
              },
              lastName: {
                type: "string",
                example: "kalisa",
              },
              password: {
                type: "string",
                example: "passwordQWE123",
              },
              confirmPassword: {
                type: "string",
                example: "passwordQWE123",
              },
          },
        },
        },
      ],
      consumes: ["application/json"],
      responses,
    },
  },
  
};

export default users;