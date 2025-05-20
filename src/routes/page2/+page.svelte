<script lang="ts">
	import { Longsheet } from '@devantic/diaper'
	let open = $state(false)
</script>

<button onclick={() => (open = true)}>Open</button>

<Longsheet bind:open>
	Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea mollitia ipsum deleniti veritatis? Praesentium similique inventore, facilis nulla necessitatibus
	reiciendis deserunt provident nemo dolor ipsum tempore iste consequatur quod ullam.
</Longsheet>
