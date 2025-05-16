<script lang="ts">
	import { Longsheet } from '$lib/components'
	import { ChevronDownIcon, X } from '@lucide/svelte'
	let open = $state(false)
</script>

<div class="space-y-2">
	<h2 class="h3 border-b">Long sheet</h2>
	<p>The entire sheet is scrollable.</p>
	<button class="btn btn-sm preset-outlined-secondary-600-400" onclick={() => (open = true)}>Cross</button>
</div>

<link rel="preload" as="image" href="https://picsum.photos/id/69/300/400" />

<Longsheet bind:open>
	<div class="flex flex-col">
		<button class="absolute top-4 right-4 btn-icon preset-filled-surface-500 rounded-full" onclick={() => (open = false)}><X /></button>

		<img src="https://picsum.photos/id/69/300/400" alt="" />
		<div class="flex flex-col items-center pt-2 pb-6 px-4 gap-4 text-pretty">
			<h1 class="text-center h2 pt-4">Scroll down</h1>
			<icon class="btn btn-icon btn-icon-lg"><ChevronDownIcon /></icon>
			<p>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione cum animi assumenda neque, aliquam unde ea corporis corrupti, id culpa veritatis
				nihil! Iure, unde modi numquam laudantium soluta provident inventore.
			</p>
			<p>
				Magnam, officiis veritatis quaerat est perspiciatis quam repellendus pariatur exercitationem cupiditate veniam magni sint atque quia error nulla
				consequatur eum, quasi odio alias nobis. Rem facilis accusamus corrupti laborum alias?
			</p>
			<p>
				Quos quisquam, quasi tempore, quaerat eaque soluta sapiente dolor nemo omnis consequuntur nulla animi facilis quia saepe ratione earum odit molestias!
				Voluptatum repudiandae culpa, amet porro quia iure dolore optio.
			</p>
			<p>
				Placeat nobis quisquam deleniti iste magnam ab quaerat corrupti quam eius rem nemo est veniam accusantium, quae ducimus facilis impedit saepe quis.
				Commodi amet sequi assumenda nostrum dignissimos, alias qui!
			</p>
			<p>
				Minima consequatur illo corporis nobis laboriosam, officiis delectus aliquid, voluptatem sapiente doloremque atque est dolor. Distinctio mollitia
				maiores quaerat illo in nemo amet corrupti, dicta dolor aliquam dolorum eum quas.
			</p>
			<p>
				Assumenda beatae reiciendis porro odio labore sapiente itaque placeat unde aspernatur repudiandae rerum quod nam dicta cumque magni, repellat veritatis
				consequuntur a quas minima praesentium fuga. Necessitatibus voluptas laudantium hic?
			</p>
			<p>
				Pariatur exercitationem aspernatur voluptatem adipisci assumenda nam sint error labore molestias officiis delectus, laboriosam itaque maxime vitae eos
				illo magnam esse ratione. Earum suscipit eum possimus sapiente nemo id esse!
			</p>
			<p>
				Laboriosam dicta sequi nam ab ea similique est error animi veritatis obcaecati vitae quisquam in eos iusto, quo modi totam a ullam. Consequuntur
				distinctio quidem perspiciatis nisi. Culpa, architecto neque?
			</p>
			<p>
				In, exercitationem, alias iste quae, excepturi voluptates autem unde error corporis amet ducimus eaque aperiam dolore quaerat tenetur? Eos molestias
				repellendus labore sit dicta nesciunt voluptatem cupiditate aliquam obcaecati velit?
			</p>
			<p>
				Quam eaque ex dignissimos culpa rem similique aperiam, quisquam cupiditate aliquid tempora quo recusandae ab, placeat accusantium! Qui iusto aliquam
				laudantium perferendis iure, illo ex consectetur dolores nam reprehenderit consequuntur?
			</p>
		</div>
	</div>
</Longsheet>
