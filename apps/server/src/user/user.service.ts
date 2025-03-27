import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { TUserBody } from './user.schema';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(private readonly userModel: UserModel) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findByEmail(email);
    return user;
  }

  async create(body: TUserBody) {
    body.password = await hash(body.password, 10);
    const user = await this.userModel.create(body);
    return user;
  }
}
