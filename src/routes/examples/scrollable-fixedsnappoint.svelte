<script lang="ts">
	import Bottomsheet from '$lib/components'
	import Header from './header.svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4">Scrollable with fixed snap point</h2>
	<p>Scrollable sheet that can be minimized to specified snap point.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open snapPoints={[0.5]}>
	{#snippet header()}
		<Header title="Scrollable Sheet" subtitle="With Fixed Snap Point" onclick={() => (open = false)} />
	{/snippet}
	<div class="p-4">
		<p>Scrollable sheet that can be minimized to specified snap point.</p>
		<br />
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, qui! Maiores praesentium veniam delectus illo, quod facere necessitatibus quasi cum
			autem laboriosam consectetur repellendus voluptates ut sint impedit quam? Praesentium.
		</p>
		<br />
		<div class="space-y-2">
			{#each { length: 25 }, i}
				<div class="card preset-filled-surface-200-800 p-4">Item {i + 1}</div>
			{/each}
		</div>
	</div>
</Bottomsheet>
