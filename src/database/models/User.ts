import { Table, Column, Model, DataType, AllowNull } from "sequelize-typescript";

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
  firstName!:string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!:string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone!:string;
  
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
}
