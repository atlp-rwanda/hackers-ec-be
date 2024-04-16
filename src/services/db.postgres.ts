import sequelize from "../database/db";
const connectionToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.error("Enable to connect to the database", error);
  }
};

export default connectionToDatabase;
