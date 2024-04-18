import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;

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
  })
  confirmPassword!: string;

  @Column({
    type: DataType.ENUM("BUYER", "ADMIN", "SELLER"),
    allowNull: false,
    defaultValue: "BUYER",
  })
  role!: string;
}
