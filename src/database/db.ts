import { Sequelize } from "sequelize-typescript";
import { DBCONNECTION } from "../utils/keys";

const sequelize = new Sequelize(DBCONNECTION as string, {
  dialect: "postgres",
});

export default sequelize;
