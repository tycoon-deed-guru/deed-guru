import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { createSupabaseServerClient } from '$lib/server/auth/supabase';
import { db } from '$lib/server/db';
import { alphaWhitelist, users } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	try {
		const { email, password, fullName } = await request.json();

		// Validate input
		if (!email || !password || !fullName) {
			throw error(400, 'Email, password, and full name are required');
		}

		if (password.length < 8) {
			throw error(400, 'Password must be at least 8 characters');
		}

		// Check if email is whitelisted for alpha access
		const whitelisted = await db
			.select()
			.from(alphaWhitelist)
			.where(eq(alphaWhitelist.email, email.toLowerCase()))
			.limit(1);

		if (whitelisted.length === 0) {
			throw error(403, 'This email is not whitelisted for alpha access. Please request an invitation at alpha@deed.guru');
		}

		// Create Supabase auth user
		const supabase = createSupabaseServerClient({ cookies, locals });

		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
				},
			},
		});

		if (authError) {
			throw error(400, authError.message);
		}

		if (!authData.user) {
			throw error(500, 'Failed to create user');
		}

		// Create user record in our database
		await db.insert(users).values({
			id: authData.user.id,
			email: email.toLowerCase(),
		});

		return json({ success: true, user: authData.user });
	} catch (err) {
		console.error('Signup error:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'An error occurred during signup');
	}
};
