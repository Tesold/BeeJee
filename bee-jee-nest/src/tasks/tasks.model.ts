import { IsEmail, isEmail } from 'class-validator';
import {
    Model,
    Table,
    Column,
    DataType,
  } from 'sequelize-typescript';

  
  interface TaskCreationInterface {
    UserName: string;
    Email: string;
    Text:string;
  }
  
  @Table({ tableName: 'Tasks' })
  export class Task extends Model<Task, TaskCreationInterface> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    ID: number;
  
    @Column({ type: DataType.TEXT, allowNull: false})
    UserName: string;
    
    @IsEmail({},{})
    @Column({ type: DataType.TEXT, allowNull: false })
    Email: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    Text: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    Status: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    Edited: boolean;

  }