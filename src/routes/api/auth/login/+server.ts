import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/auth/supabase';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	try {
		const { email, password } = await request.json();

		// Validate input
		if (!email || !password) {
			throw error(400, 'Email and password are required');
		}

		// Create Supabase auth client
		const supabase = createSupabaseServerClient({ cookies, locals });

		const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (authError) {
			// Provide user-friendly error messages
			if (authError.message.includes('Invalid login credentials')) {
				throw error(401, 'Invalid email or password');
			}
			if (authError.message.includes('Email not confirmed')) {
				throw error(401, 'Please verify your email address');
			}
			throw error(401, authError.message);
		}

		if (!authData.user) {
			throw error(500, 'Login failed');
		}

		return json({ success: true, user: authData.user });
	} catch (err) {
		console.error('Login error:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'An error occurred during login');
	}
};
