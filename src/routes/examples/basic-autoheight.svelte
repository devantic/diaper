<script lang="ts">
	import Bottomsheet from '$lib/components'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4">Basic with auto height</h2>
	<p>Opens at auto height to fit content.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open height="auto">
	<div class="text-center flex flex-col items-center pt-6 pb-6 px-4 gap-4">
		<h1 class="h2 pt-4 text-balance">Auto height</h1>
		<p class="opacity-75">Auto sizes to fit content</p>
		<code class="code">{`height="auto"`}</code>
		<button class="btn preset-filled-surface-800-200 rounded-full px-8" onclick={() => (open = false)}>Got It</button>
	</div>
</Bottomsheet>
