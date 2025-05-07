<script lang="ts">
	import { Floatingsheet } from '$lib/components'
	import { AlertTriangleIcon, X } from '@lucide/svelte'
	let open = $state(false)
	let justify = $state('center')
	let resistance = $state('normal')
</script>

<div class="space-y-2">
	<h2 class="h3 border-b">Floating sheet</h2>
	<select class="select" bind:value={justify}>
		<option value="center">Center</option>
		<option value="start">Start</option>
		<option value="end">End</option>
	</select>
	<select class="select" bind:value={resistance}>
		<option value="none">None</option>
		<option value="normal">Normal</option>
		<option value="futile">Futile</option>
	</select>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<link rel="preload" as="image" href="https://picsum.photos/id/830/170/170" />

<Floatingsheet bind:open {justify} {resistance} class="bg-warning-400-600! rounded-lg!">
	<div class="flex justify-start items-center p-4 py-6 gap-4">
		<icon class=""><AlertTriangleIcon /></icon>
		<span class="font-semibold text-lg">Detached Sheet</span>
	</div>
</Floatingsheet>
