import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import type { TUserBody } from './users.schema';
import { UsersModel } from './users.model';

@Injectable()
export class UsersService {
  constructor(private readonly userModel: UsersModel) {}

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

  async getUsersByIds(ids: string[]) {
    const users = await this.userModel.getUsersByIds(ids);
    return users;
  }
}
