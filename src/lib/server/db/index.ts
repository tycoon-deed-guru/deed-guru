import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { building } from '$app/environment';

// Support both SvelteKit and standalone execution
let DATABASE_URL: string;
try {
	const { env } = await import('$env/dynamic/private');
	DATABASE_URL = env.DATABASE_URL;
} catch {
	DATABASE_URL = process.env.DATABASE_URL || '';
}

// Don't connect to database during build time
if (!building) {
	if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
}

// Use a dummy URL during build to prevent postgres client errors
const client = postgres(building ? 'postgres://localhost/dummy' : DATABASE_URL, {
	max: building ? 0 : 10, // No connections during build
});

export const db = drizzle(client, { schema });
