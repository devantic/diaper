<script lang="ts">
	import Bottomsheet from '@devantic/diaper'
	import Header from './header.svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4">Basic with auto snap point</h2>
	<p>Opens at max height but can be miminized to fit content</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open snapPoints="auto">
	{#snippet header()}
		<Header title="Basic Sheet" subtitle="with auto snap point" onclick={() => (open = false)} />
	{/snippet}
	<div class="p-4">
		<p>Opens at max height but can be miminized to fit content</p>
		<br />
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, qui! Maiores praesentium veniam delectus illo, quod facere necessitatibus quasi cum
			autem laboriosam consectetur repellendus voluptates ut sint impedit quam? Praesentium.
		</p>
	</div>
</Bottomsheet>
