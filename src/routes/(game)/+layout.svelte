<script lang="ts">
	let { children } = $props();
</script>

<!-- Game Layout - Full Screen, No Sidebar -->
<div class="game-layout">
	{@render children()}
</div>

<style>
	.game-layout {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #0f172a;
		margin: 0;
		padding: 0;
	}

	/* Override any global styles that might interfere */
	:global(html),
	:global(body) {
		margin: 0 !important;
		padding: 0 !important;
		overflow: hidden !important;
		height: 100% !important;
		width: 100% !important;
	}
</style>
