import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
} from 'typeorm';
import { Document } from 'mongoose';

export type UserDocument = Users & Document;

@Entity('users')
export class Users {
  @ObjectIdColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'username', unique: true })
  username: string;

  @Column('varchar', { name: 'password' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn()
  passwordExpiresAt: number;
}
