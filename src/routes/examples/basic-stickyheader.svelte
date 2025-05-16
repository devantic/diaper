<script lang="ts">
	import Bottomsheet from '$lib/components'
	import Header from './header.svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4">Basic with sticky header</h2>
	<p>The header sticks to the bottom of the screen</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open stickyHeader toggleOnHeaderTap>
	{#snippet header()}
		<Header title="Basic Sheet" subtitle="with sticky header" onclick={() => (open = false)} />
	{/snippet}
	<div class="p-4 space-y-4">
		<p>Tap the header to minimize or maximize with the <code class="code">toggleOnHeaderTap</code> prop.</p>
		<p>Open it minimized using the <code class="code">{`openSticky`}</code> prop.</p>
	</div>
</Bottomsheet>
