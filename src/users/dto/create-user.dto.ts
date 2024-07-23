import { Types } from 'mongoose';

export class CreateUsersDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly createdBy: string | Types.ObjectId;
}
