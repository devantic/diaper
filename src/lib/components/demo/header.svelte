<script>
	let { title, subtitle, onclick } = $props()
</script>

<div class="p-4 pr-0 flex justify-between items-start border-b border-b-surface-700-300">
	<div>
		<h2 class="h4">{title}</h2>
		<p class="italic font-medium">{subtitle}</p>
	</div>
	<button class="btn text-[#007AFF] font-medium outline-none" {onclick}>Close</button>
</div>
