<script lang="ts">
	import Bottomsheet from '$lib/components'
	import Header from './header.svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h4">Dynamic content with fixed snap points</h2>
	<p>Specify fixed snappoints at which the content will change.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Open</button>
</div>

<Bottomsheet bind:open snapPoints={[0.25, 0.7]}>
	{#snippet header()}
		<Header title="Dynamic Content Sheet" subtitle="with fixed snap points" onclick={() => (open = false)} />
	{/snippet}
	<div class="p-4">
		<p>This sheet has snap points at 0.25 and 0.7.</p>
		<br />
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, qui! Maiores praesentium veniam delectus illo, quod facere necessitatibus quasi cum
			autem laboriosam consectetur repellendus voluptates ut sint impedit quam? Praesentium.
		</p>
	</div>
	{#snippet snapPoint1Content()}
		<div class="p-4">
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis fuga at sed porro minus, nulla dolorum nesciunt dolor dolorem sunt eligendi numquam
				expedita facilis odit, tempora voluptatibus voluptates quas! Animi?
			</p>
			<br />
			<p>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut facere reiciendis hic modi. Quo rerum quaerat consequuntur tempore dolorum recusandae,
				quidem illum sint, iste deleniti officiis ea ipsa nam eligendi!
			</p>
		</div>
	{/snippet}
	{#snippet snapPoint2Content()}
		<div class="p-4">
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam dolorem nihil perspiciatis natus, animi facere veniam magni doloribus, at commodi
			expedita vel voluptate? Similique molestiae rerum, praesentium explicabo sint dolorum.
		</div>
	{/snippet}
</Bottomsheet>
