<script lang="ts">
	import Bottomsheet from '@devantic/diaper'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4">Basic with full height</h2>
	<p>The default sheet. Opens at full height.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<link rel="preload" as="image" href="https://picsum.photos/id/133/600/400" />

<Bottomsheet bind:open>
	{#snippet header()}
		<img src="https://picsum.photos/id/133/600/400" class="w-full" alt="" />
	{/snippet}
	<div class="text-center flex h-full flex-col items-center pt-6 pb-6 px-4 gap-4">
		<div class="space-y-4">
			<h1 class="h2 pt-4">Basic Sheet</h1>
			<p class="opacity-75">
				Opens at full height and scales body down behind it. Body scaling can be disabled using the <code class="code">flat</code> prop.
			</p>
		</div>
		<button class="btn preset-filled-surface-800-200 rounded-full px-8 my-4" onclick={() => (open = false)}>Got It!</button>
	</div>
</Bottomsheet>
