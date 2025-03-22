import { Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { hash } from 'bcrypt';
import { TUserSchema } from './user.schema';

@Injectable()
export class UserService {
  async findByEmail(email: string) {
    const user = await UserModel.where('email', email).first();
    return user;
  }

  async create(body: TUserSchema) {
    body.password = await hash(body.password, 10)
    const user = await UserModel.create(body);
    return user
  }
}
