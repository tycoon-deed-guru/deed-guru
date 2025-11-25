<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();
</script>

<!-- Marketing Layout - No Sidebar -->
<div class="min-h-screen flex flex-col">
	<!-- Top Navigation -->
	<nav class="border-b bg-background backdrop-blur sticky top-0 z-50 shadow-sm">
		<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2">
				<img src="/images/deedguru.gold.png" alt="deed.guru" class="h-12 hidden dark:block" />
				<img src="/images/deedguru.navy.png" alt="deed.guru" class="h-12 dark:hidden" />
				<span class="text-xl font-bold">deed.guru</span>
			</a>

			<!-- Navigation Links -->
			<div class="hidden md:flex items-center gap-6">
				<a href="/#features" class="text-sm font-medium hover:text-primary transition-colors">Features</a>
				<a href="/pricing" class="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
				<a href="/#how-it-works" class="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
				<a href="/#testimonials" class="text-sm font-medium hover:text-primary transition-colors">Testimonials</a>
			</div>

			<!-- CTA Buttons -->
			<div class="flex items-center gap-3">
				<ThemeToggle />
				<Button variant="ghost" href="/login" size="sm">
					Sign In
				</Button>
				<Button href="/signup" size="sm" class="hidden sm:inline-flex">
					Start Free Trial
				</Button>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t bg-muted/50 mt-16">
		<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl py-12">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
				<!-- Brand -->
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<img src="/images/deedguru.gold.svg" alt="deed.guru" class="h-8 hidden dark:block" />
						<img src="/images/deedguru.navy.svg" alt="deed.guru" class="h-8 dark:hidden" />
						<span class="text-lg font-bold">deed.guru</span>
					</div>
					<p class="text-sm text-muted-foreground">
						AI-powered real estate tokenization platform built on Hedera Guardian.
					</p>
				</div>

				<!-- Product -->
				<div>
					<h4 class="font-semibold mb-4">Product</h4>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li><a href="/#features" class="hover:text-foreground">Features</a></li>
						<li><a href="/pricing" class="hover:text-foreground">Pricing</a></li>
						<li><a href="/#how-it-works" class="hover:text-foreground">How It Works</a></li>
						<li><a href="/dashboard" class="hover:text-foreground">Dashboard</a></li>
					</ul>
				</div>

				<!-- Company -->
				<div>
					<h4 class="font-semibold mb-4">Company</h4>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li><a href="/about" class="hover:text-foreground">About</a></li>
						<li><a href="/blog" class="hover:text-foreground">Blog</a></li>
						<li><a href="/contact" class="hover:text-foreground">Contact</a></li>
						<li><a href="/careers" class="hover:text-foreground">Careers</a></li>
					</ul>
				</div>

				<!-- Legal -->
				<div>
					<h4 class="font-semibold mb-4">Legal</h4>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li><a href="/privacy" class="hover:text-foreground">Privacy Policy</a></li>
						<li><a href="/terms" class="hover:text-foreground">Terms of Service</a></li>
						<li><a href="/security" class="hover:text-foreground">Security</a></li>
					</ul>
				</div>
			</div>

			<div class="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
				<p>&copy; {new Date().getFullYear()} deed.guru. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>
