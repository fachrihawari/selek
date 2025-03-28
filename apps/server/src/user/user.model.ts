import { Injectable } from '@nestjs/common';
import { TUser, TUserBody } from './user.schema';
import { sql } from 'src/db/sql';

@Injectable()
export class UserModel {
  async findById(id: string) {
    const users = await sql<TUser[]>`
      SELECT id, full_name, email, password
      FROM users WHERE id = ${id}
      LIMIT 1
    `;
    return users[0] ?? null;
  }

  async findByEmail(email: string) {
    const users = await sql<TUser[]>`
      SELECT id, full_name, email, password
      FROM users WHERE email = ${email}
      LIMIT 1
    `;
    return users[0] ?? null;
  }

  async create(body: TUserBody) {
    const result = await sql<TUser[]>`
      INSERT INTO users ${sql(body)} 
      RETURNING id, full_name, email, password
    `;
    return result[0];
  }
}
