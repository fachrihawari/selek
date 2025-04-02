import { Injectable } from '@nestjs/common';
import { TUser, TUserBody } from './users.schema';
import { sql } from '~/db/sql';

@Injectable()
export class UsersModel {
  columns = ['id', 'fullName', 'email', 'password'];

  async findById(id: string): Promise<TUser | null> {
    const [user] = await sql<TUser[]>`
      SELECT ${sql(this.columns)}
      FROM users WHERE id = ${id}
      LIMIT 1
    `;
    return user ?? null;
  }

  async findByEmail(email: string): Promise<TUser | null> {
    const [user] = await sql<TUser[]>`
      SELECT ${sql(this.columns)}
      FROM users WHERE email = ${email}
      LIMIT 1
    `;
    return user ?? null;
  }

  async create(body: TUserBody) {
    const [user] = await sql<TUser[]>`
      INSERT INTO users ${sql(body)} 
      RETURNING ${sql(this.columns)}
    `;
    return user;
  }
}
