import { hash } from "bcrypt";
import { sql } from "bun";


async function seed() {
    await sql`DELETE FROM users`

    const user = {
        full_name: "ai",
        email: "ai@mail.com",
        password: await hash("ai", 10),
    }

    await sql`INSERT INTO users ${sql(user)}`;

    console.info(`Seeder done.`);
}

seed().catch(console.error);