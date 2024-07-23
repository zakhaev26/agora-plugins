import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { UserRole, UserRolesEnum } from '../constants/user-roles.enum';

const { ObjectId } = SchemaTypes;
/**
 * @note imp..!
 */
export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true,
})
export class Users {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({
    required: true,
    trim: true,
    enum: UserRolesEnum,
    default: UserRole.USER,
  })
  role: number;

  @Prop({
    required: true,
    type: ObjectId,
    ref: Users.name,
  })
  createdBy: Types.ObjectId;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
