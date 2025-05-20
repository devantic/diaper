<script lang="ts">
	import Bottomsheet from '@devantic/diaper'
	import Header from './header.svelte'
	let bottomsheet: Bottomsheet
</script>

<div class="space-y-2">
	<h2 class="h3 border-b">Programmatic Control</h2>
	<p>Use instance methods to control the sheet: showModal, close, snapTo.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={bottomsheet.showModal}>Open</button>
</div>

<Bottomsheet bind:this={bottomsheet} snapPoints={[0.3]}>
	{#snippet header()}
		<Header title="Programmatic Control" subtitle="" onclick={bottomsheet.close} />
	{/snippet}
	<div class="p-4">
		<p>This sheet is controlled programatically. Use the <code>bind:this=&#123;bottomsheet&#125;</code> to expose the instance methods</p>
		<br />
		<ul class="list-inside list-disc">
			<li>showModal()</li>
			<li>close()</li>
			<li>snapTo(index)</li>
		</ul>
	</div>
	<div class="flex flex-col gap-4 p-8">
		<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => bottomsheet.snapTo(1)}>Snap</button>
		<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={bottomsheet.close}>Close</button>
	</div>
</Bottomsheet>
