import {
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
} from "../../utils/keys";
module.exports = {
  development: {
    database: DB_NAME,
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "postgres",
  },
};
