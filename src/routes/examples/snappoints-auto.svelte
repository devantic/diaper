<script lang="ts">
	import Bottomsheet from '@devantic/diaper'
	import Header from './header.svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4">Auto snap point</h2>
	<p>Opens at max height andminimized to fit content.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open snapPoints="auto">
	{#snippet header()}
		<Header title="Auto Snap Point" subtitle="" onclick={() => (open = false)} />
	{/snippet}
	<div class="p-4 space-y-4">
		<p>Opens at max height and minimized to fit content.</p>
		<code class="inline-block code">{'<Bottomsheet snapPoints="auto">'}</code>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, qui! Maiores praesentium veniam delectus illo, quod facere necessitatibus quasi cum
			autem laboriosam consectetur repellendus voluptates ut sint impedit quam? Praesentium.
		</p>
	</div>
</Bottomsheet>
