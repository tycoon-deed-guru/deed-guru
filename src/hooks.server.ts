import { createSupabaseServerClient } from '$lib/server/auth/supabase';
import { db } from '$lib/server/db';
import { alphaWhitelist } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, type Handle } from '@sveltejs/kit';

// Routes that don't require whitelist access
const PUBLIC_ROUTES = [
	'/waitlist',
	'/login',
	'/signup',
	'/auth/callback',
	'/auth',
	'/api/auth',
];

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client and get session
	const supabase = createSupabaseServerClient(event);
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Make user available to all routes via event.locals
	event.locals.supabase = supabase;
	event.locals.session = session;

	const pathname = event.url.pathname;

	// Allow public routes without authentication
	const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

	if (!isPublicRoute) {
		// Require authentication for all protected routes
		if (!session?.user?.email) {
			// Not authenticated - redirect to waitlist
			throw redirect(303, '/waitlist');
		}

		// User is authenticated - check if they're whitelisted
		const whitelisted = await db
			.select()
			.from(alphaWhitelist)
			.where(eq(alphaWhitelist.email, session.user.email))
			.limit(1);

		if (whitelisted.length === 0) {
			// Authenticated but not whitelisted - redirect to waitlist
			throw redirect(303, '/waitlist');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		},
	});
};
