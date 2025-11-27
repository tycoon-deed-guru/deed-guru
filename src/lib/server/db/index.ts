import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { building } from '$app/environment';
import { DATABASE_URL } from '$env/static/private';

// Lazy-initialize the database connection
let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getClient() {
	if (building) {
		// Return a dummy client during build
		return postgres('postgres://localhost/dummy', { max: 0 });
	}

	if (!_client) {
		if (!DATABASE_URL) {
			throw new Error('DATABASE_URL is not set');
		}
		_client = postgres(DATABASE_URL, { max: 10 });
	}
	return _client;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(_target, prop) {
		if (!_db) {
			_db = drizzle(getClient(), { schema });
		}
		return (_db as any)[prop];
	}
});
