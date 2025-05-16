<script lang="ts">
	import Bottomsheet from '$lib/components'
	import Header from './header.svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4" style="text-box-trim: end;">Fixed snap points</h2>
	<p>Opens at max height and snapped to specified points.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open snapPoints={[0.25, 0.7]}>
	{#snippet header()}
		<Header title="Fixed Snap Points" subtitle="" onclick={() => (open = false)} />
	{/snippet}
	<div class="p-4 space-y-4">
		<p>Opens at max height and snapped to specified points. e.g. this sheet has snappoints at 25% and 70% of the sheet height:</p>
		<code class="inline-block code">{'<Bottomsheet snapPoints={[0.25, 0.7]}>'}</code>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, qui! Maiores praesentium veniam delectus illo, quod facere necessitatibus quasi cum
			autem laboriosam consectetur repellendus voluptates ut sint impedit quam? Praesentium.
		</p>
	</div>
</Bottomsheet>
