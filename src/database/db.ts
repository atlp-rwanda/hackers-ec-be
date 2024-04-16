import { Sequelize } from "sequelize-typescript";
import path from "path";
import {
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
} from "../utils/keys";

const sequelize = new Sequelize({
  database: DB_NAME,
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  dialect: DB_DIALECT as any,
  models: [path.join(__dirname, "./models")],
});

export default sequelize;
