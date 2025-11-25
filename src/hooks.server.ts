import { createSupabaseServerClient } from '$lib/server/auth/supabase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client and get session
	const supabase = createSupabaseServerClient(event);
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Make user available to all routes via event.locals
	event.locals.supabase = supabase;
	event.locals.session = session;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		},
	});
};
