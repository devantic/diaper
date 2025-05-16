<script lang="ts">
	import Bottomsheet from '$lib/components'
	import Header from './header.svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h3 border-b">Scrollable</h2>
	<p>Sheets are automatically scrollable when content overflows.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open>
	{#snippet header()}
		<Header title="Scrollable Sheet" subtitle="" onclick={() => (open = false)} />
	{/snippet}
	<div class="p-4">
		<p>The main content is scrollable. You can make the content scroll under the header using the <code class="code">headerOverlaysContent</code> prop.</p>
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
