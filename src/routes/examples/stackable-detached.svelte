<script lang="ts">
	import { Detachedsheet } from '@devantic/diaper'
	let open1 = $state(false)
	let open2 = $state(false)
	let open3 = $state(false)
	let open4 = $state(false)

	let images = [
		'https://picsum.photos/id/400/600/400',
		'https://picsum.photos/id/401/600/400',
		'https://picsum.photos/id/402/600/400',
		'https://picsum.photos/id/403/600/400'
	]
</script>

<div class="space-y-2">
	<h2 class="h3 border-b">Stackable Detached</h2>
	<p>Detached sheets can be stacked too.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open1 = true)}>Open</button>
</div>

<link rel="preload" as="image" href={images[0]} />
<link rel="preload" as="image" href={images[1]} />
<link rel="preload" as="image" href={images[2]} />
<link rel="preload" as="image" href={images[3]} />

<Detachedsheet bind:open={open1} height="auto">
	{#snippet header()}{/snippet}
	<img src={images[0]} class="w-full aspect-[3/2]" alt="" />
	<div class="p-4">
		<div class="text-center p-8">
			<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open2 = true)}>Open another</button>
		</div>
	</div>
</Detachedsheet>

<Detachedsheet bind:open={open2} height="auto">
	{#snippet header()}{/snippet}
	<img src={images[1]} class="w-full aspect-[3/2]" alt="" />
	<div class="p-4">
		<div class="text-center p-8">
			<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open3 = true)}>Open another</button>
		</div>
	</div>
</Detachedsheet>

<Detachedsheet bind:open={open3} height="auto">
	{#snippet header()}{/snippet}
	<img src={images[2]} class="w-full aspect-[3/2]" alt="" />
	<div class="p-4">
		<div class="text-center p-8">
			<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open4 = true)}>Open another</button>
		</div>
	</div>
</Detachedsheet>

<Detachedsheet bind:open={open4} height="auto">
	{#snippet header()}{/snippet}
	<img src={images[3]} class="w-full aspect-[3/2]" alt="" />
	<div class="p-4">
		<div class="text-center p-8">
			<button class="m-auto btn btn-sm text-center preset-outlined-secondary-600-400" onclick={() => (open4 = false)}>Okay, that's enough</button>
		</div>
	</div>
</Detachedsheet>
