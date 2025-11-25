import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Create Supabase client for server-side operations
 * Handles cookie-based auth for SSR
 */
export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient(
		publicEnv.PUBLIC_SUPABASE_URL,
		publicEnv.PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				},
			},
		}
	);
}

/**
 * Get authenticated user from request
 * Returns null if not authenticated
 */
export async function getUser(event: RequestEvent) {
	const supabase = createSupabaseServerClient(event);
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(event: RequestEvent) {
	const user = await getUser(event);
	if (!user) {
		throw new Error('Unauthorized');
	}
	return user;
}
