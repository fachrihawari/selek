import { Injectable } from '@nestjs/common';
import { TUser, TUserBody } from './users.schema';
import { sql } from '~/db/sql';

@Injectable()
export class UsersModel {
  async findById(id: string): Promise<TUser | null> {
    const [user] = await sql<TUser[]>`
      SELECT id, "fullName", email, password
      FROM users WHERE id = ${id}
      LIMIT 1
    `;
    return user ?? null;
  }

  async findByEmail(email: string): Promise<TUser | null> {
    const [user] = await sql<TUser[]>`
      SELECT id, "fullName", email, password
      FROM users WHERE email = ${email}
      LIMIT 1
    `;
    return user ?? null;
  }

  async create(body: TUserBody) {
    const [user] = await sql<TUser[]>`
      INSERT INTO users ${sql(body)} 
      RETURNING id, "fullName", email, password
    `;
    return user;
  }
}
