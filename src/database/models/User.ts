import { Table, Column, Model, DataType } from "sequelize-typescript";

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
    unique: true,
        })
  email!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  password!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "buyer",
  })
  role!: string;
}
