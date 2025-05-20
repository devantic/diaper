<script lang="ts">
	import Bottomsheet from '@devantic/diaper'
	let open = $state(false)
	let bottomsheet: Bottomsheet | undefined = $state(undefined)
</script>

<!-- Trigger -->
<button onclick={() => (open = true)}>Open</button>

<!-- Sheet -->
{#if open}
	<Bottomsheet bind:this={bottomsheet} {open} onclose={() => (open = false)}>
		<button onclick={bottomsheet.close}>Close</button>
		<div style="padding: 1rem">
			<p>The default sheet</p>
			<br />
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, qui! Maiores praesentium veniam delectus illo, quod facere necessitatibus quasi cum
				autem laboriosam consectetur repellendus voluptates ut sint impedit quam? Praesentium.
			</p>
		</div>
	</Bottomsheet>
{/if}
