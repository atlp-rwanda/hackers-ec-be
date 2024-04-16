import express from "express";
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import userRoutes from "./routes/userRoutes";
import { PORT } from "./utils/keys";


const app = express();
app.use(express.json());

const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'yoyo E-commerce API',
        version: '1.0.0',
        description: 'API endpoints for yoyo e-commerce documented on swagger',
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
      servers: [
        {
          url: `http://localhost:${PORT}/`,
          description: "Local server"
        },
        {
          url: "<hosted url>",
          description: "Live server"
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/Docs/*.ts'], // Specify the path to our route files
  };

  const swaggerSpec = swaggerJsdoc(options);
  app.use("/api/v1/Docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.use("/api/v1", userRoutes);

export default app;
