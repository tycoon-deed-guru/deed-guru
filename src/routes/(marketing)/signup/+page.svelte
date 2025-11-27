<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';

	let email = $state('');
	let password = $state('');
	let fullName = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleSignup() {
		loading = true;
		error = null;

		// Basic validation
		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			loading = false;
			return;
		}

		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, fullName }),
			});

			// Try to parse response as JSON
			let data: { message?: string } = {};
			try {
				const text = await res.text();
				data = text ? JSON.parse(text) : {};
			} catch (parseError) {
				// Response is not JSON - use status-based error
				console.error('Failed to parse response:', parseError);

				if (!res.ok) {
					if (res.status === 400) {
						throw new Error('Please check your information and try again');
					} else if (res.status === 403) {
						throw new Error('This email is not whitelisted for alpha access. Please request an invitation at alpha@deed.guru');
					} else if (res.status === 409) {
						throw new Error('An account with this email already exists');
					} else if (res.status === 404) {
						throw new Error('Service unavailable. Please try again later.');
					} else {
						throw new Error('Unable to create account. Please try again.');
					}
				}

				throw new Error('Unexpected response from server');
			}

			// Check if request failed
			if (!res.ok) {
				throw new Error(data.message || 'Unable to create account. Please try again.');
			}

			// Success - redirect to dashboard
			window.location.href = '/dashboard';
		} catch (err) {
			// Ensure we never show technical errors to users
			if (err instanceof Error) {
				// Only show user-friendly errors
				if (err.message.includes('JSON') || err.message.includes('token') || err.message.includes('Unexpected')) {
					error = 'Unable to create account. Please try again.';
				} else {
					error = err.message;
				}
			} else {
				error = 'An error occurred. Please try again.';
			}
		} finally {
			loading = false;
		}
	}

	async function handleGoogleSignup() {
		// TODO: Implement Google OAuth
		alert('Google signup coming soon!');
	}
</script>

<svelte:head>
	<title>Sign Up - deed.guru</title>
</svelte:head>

<div class="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center">
			<Badge variant="secondary" class="w-fit mx-auto mb-2">
				Start Free Trial
			</Badge>
			<CardTitle class="text-2xl">Create Your Account</CardTitle>
			<CardDescription>No credit card required. 14-day free trial.</CardDescription>
		</CardHeader>
		<CardContent>
			<form onsubmit={(e) => { e.preventDefault(); handleSignup(); }} class="space-y-4">
				<!-- Full Name -->
				<div class="space-y-2">
					<Label for="fullName">Full Name</Label>
					<Input
						id="fullName"
						type="text"
						bind:value={fullName}
						placeholder="John Doe"
						required
						disabled={loading}
					/>
				</div>

				<!-- Email -->
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						disabled={loading}
					/>
				</div>

				<!-- Password -->
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						required
						disabled={loading}
					/>
					<p class="text-xs text-muted-foreground">
						Must be at least 8 characters
					</p>
				</div>

				<!-- Error Message -->
				{#if error}
					<div class="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
						{error}
					</div>
				{/if}

				<!-- Terms Agreement -->
				<p class="text-xs text-muted-foreground">
					By creating an account, you agree to our
					<a href="/terms" class="text-primary hover:underline">Terms of Service</a>
					and
					<a href="/privacy" class="text-primary hover:underline">Privacy Policy</a>.
				</p>

				<!-- Submit Button -->
				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Creating account...' : 'Start Free Trial'}
				</Button>

				<!-- Divider -->
				<div class="relative my-6">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 bg-background text-muted-foreground">Or continue with</span>
					</div>
				</div>

				<!-- Google Signup -->
				<Button
					type="button"
					variant="outline"
					class="w-full"
					onclick={handleGoogleSignup}
					disabled={loading}
				>
					<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
					Continue with Google
				</Button>

				<!-- Login Link -->
				<p class="text-center text-sm text-muted-foreground">
					Already have an account?
					<a href="/login" class="font-medium text-primary hover:underline">
						Sign in
					</a>
				</p>
			</form>

			<!-- Trust Badges -->
			<div class="mt-8 pt-6 border-t">
				<p class="text-xs text-center text-muted-foreground mb-3">
					Trusted by 500+ investors
				</p>
				<div class="flex items-center justify-center gap-4 text-xs text-muted-foreground">
					<div class="flex items-center gap-1">
						<span>🔒</span>
						<span>SOC 2 Compliant</span>
					</div>
					<div class="flex items-center gap-1">
						<span>⭐</span>
						<span>4.9/5 Rating</span>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
