import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT as any,
  models: [path.join(__dirname, "../models")],
});

export default sequelize;
