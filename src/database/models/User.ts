import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

<<<<<<< HEAD
export interface UserModelAttributes {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
=======
@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "buyer",
  })
  role!: string;
>>>>>>> 6598788 (ft(user signup):add user signup api)
}
type UserCreationAttributes = Optional<UserModelAttributes, "id"> & {
  role?: string;
};

export class User extends Model<UserModelAttributes, UserCreationAttributes> {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "BUYER", "SELLER"),
      allowNull: false,
      defaultValue: "BUYER",
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
  }
);
