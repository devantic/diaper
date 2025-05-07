<script lang="ts">
	import { Floatingsheet } from '$lib/components'
	import { X } from '@lucide/svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h3 border-b">Floating sheet</h2>
	<p>Moves</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<link rel="preload" as="image" href="https://picsum.photos/id/830/170/170" />

<Floatingsheet bind:open justify="center" resistance="normal">
	<button class="absolute top-4 right-4 btn-icon preset-filled-surface-500 rounded-full" onclick={() => (open = false)}><X /></button>
	<div class="text-center flex flex-col items-center pt-6 pb-6 px-4 gap-4 text-balance">
		<img class="rounded-2xl h-[170px]" src="https://picsum.photos/id/830/170/170" alt="" />
		<h1 class="h2 pt-4">Detached Sheet</h1>
		<p class="opacity-75 text-balance">A convenience component, <i>Detachedsheet</i>, is provided for this</p>
		<code class="code">{`<Detachedsheet height="auto">`}</code>
		<button class="btn btn-base preset-filled-surface-800-200 rounded-full px-8" onclick={() => (open = false)}>Got It</button>
	</div>
</Floatingsheet>
