import { sql } from 'bun';
import { log } from 'node:console';
import { readdir } from 'node:fs/promises';

async function migrate() {
  // Get SQL files from the sql directory
  let migrationFiles = await readdir(__dirname + '/migrations');

  // Filter and sort SQL files
  migrationFiles = migrationFiles.filter((f) => f.endsWith('.sql')).sort();

  // Execute each SQL file
  for (const migration of migrationFiles) {
    const migrationFile = __dirname + '/migrations/' + migration;
    await sql.file(migrationFile);
    log(`Executed ${migration}`);
  }

  console.log('All migrations completed successfully');
}

// Run migrations
migrate().catch(console.error);
