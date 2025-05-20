<script lang="ts">
	import Bottomsheet from '@devantic/diaper'
	import Header from './header.svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4">Initial snap point</h2>
	<p>Opens at specified snap point.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open initialIndex={1} snapPoints={[0.25, 0.7]}>
	{#snippet header()}
		<Header title="Initial Snap Point" subtitle="" onclick={() => (open = false)} />
	{/snippet}
	<div class="p-4 space-y-4">
		<p>Opens at specified snap point. This sheet opens at the first snappoint, i.e. 25% down from the top of the sheet.</p>
		<code class="inline-block code">{'snapPoints={[0.25, 0.7]} initialIndex={1}'}</code>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, qui! Maiores praesentium veniam delectus illo, quod facere necessitatibus quasi cum
			autem laboriosam consectetur repellendus voluptates ut sint impedit quam? Praesentium.
		</p>
	</div>
</Bottomsheet>
