import { Injectable } from "@nestjs/common";
import { TUser, TUserBody } from "./user.schema";
import { sql } from 'bun'

@Injectable()
export class UserModel {

    async findByEmail(email: string) {
        const users: TUser[] = await sql`SELECT id, full_name, email, password FROM users WHERE email = ${email}`
        return users[0] ?? null
    }
    
    async create(body: TUserBody) {
        const result: TUser[] = await sql`INSERT INTO users ${sql(body)} returning *`;
        return result[0]
    }

}