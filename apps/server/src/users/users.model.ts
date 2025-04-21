import { Injectable } from '@nestjs/common';
import { TUser, TUserBody, TUserQueryResult } from './users.schema';
import { sql } from '~/db/sql';

@Injectable()
export class UsersModel {
  async findById(id: string) {
    const [user] = await sql<TUserQueryResult>`
      SELECT id, "fullName", email, password
      FROM users WHERE id = ${id}
      LIMIT 1
    `;
    return user ?? null;
  }

  async findByEmail(email: string) {
    const [user] = await sql<TUserQueryResult>`
      SELECT id, "fullName", email, password
      FROM users WHERE email = ${email}
      LIMIT 1
    `;
    return user ?? null;
  }

  async create(body: TUserBody) {
    const [user] = await sql<TUserQueryResult>`
      INSERT INTO users ${sql(body)} 
      RETURNING id, "fullName", email, password
    `;
    return user;
  }
}
