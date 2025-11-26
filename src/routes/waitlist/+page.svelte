<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Lock, Mail, FileText, Shield } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Alpha Access - deed.guru</title>
	<meta name="description" content="deed.guru is currently in private alpha. Request access to join our exclusive testing program." />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
	<div class="w-full max-w-2xl">
		<!-- Alpha Badge -->
		<div class="text-center mb-8">
			<Badge variant="secondary" class="text-lg px-6 py-2 mb-6">
				<Lock class="size-5 mr-2" />
				Private Alpha Access
			</Badge>
		</div>

		<!-- Main Card -->
		<Card class="border-2">
			<CardHeader class="text-center space-y-4">
				<div class="mx-auto size-20 rounded-full bg-primary/10 flex items-center justify-center">
					<Shield class="size-10 text-primary" />
				</div>
				<CardTitle class="text-3xl md:text-4xl">
					deed.guru is in Private Alpha
				</CardTitle>
				<CardDescription class="text-lg">
					We're protecting our patent-pending methodology and limiting exposure of key innovations during development.
				</CardDescription>
			</CardHeader>

			<CardContent class="space-y-6">
				<!-- Info Boxes -->
				<div class="grid gap-4">
					<div class="flex gap-4 p-4 rounded-lg bg-muted/50">
						<FileText class="size-5 text-primary shrink-0 mt-1" />
						<div>
							<h3 class="font-semibold mb-1">Patents Pending</h3>
							<p class="text-sm text-muted-foreground">
								Our proprietary 8-Petal Bloom scoring methodology and AI-powered property analysis system are currently undergoing patent review.
							</p>
						</div>
					</div>

					<div class="flex gap-4 p-4 rounded-lg bg-muted/50">
						<Lock class="size-5 text-primary shrink-0 mt-1" />
						<div>
							<h3 class="font-semibold mb-1">Invitation Only</h3>
							<p class="text-sm text-muted-foreground">
								Access is currently limited to whitelisted alpha testers. This helps us refine the platform while protecting our intellectual property.
							</p>
						</div>
					</div>
				</div>

				<!-- CTA -->
				<div class="pt-4 space-y-4">
					<div class="text-center p-6 rounded-lg bg-primary/5 border border-primary/20">
						<Mail class="size-8 text-primary mx-auto mb-3" />
						<h3 class="font-semibold mb-2">Request Alpha Access</h3>
						<p class="text-sm text-muted-foreground mb-4">
							Interested in joining our alpha program? Contact us to request an invitation.
						</p>
						<Button asChild>
							<a href="mailto:alpha@deed.guru?subject=Alpha Access Request">
								Request Access
							</a>
						</Button>
					</div>

					<div class="text-center text-sm text-muted-foreground">
						<p>Already have access?</p>
						<Button variant="link" href="/login" class="text-primary">
							Sign In →
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Footer Note -->
		<div class="text-center mt-8 text-sm text-muted-foreground">
			<p>Protected by invitation-only access during alpha testing phase</p>
		</div>
	</div>
</div>
