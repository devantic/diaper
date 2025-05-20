<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fade, fly } from 'svelte/transition'

	type FloatingsheetProps = {
		open?: boolean
		justify?: 'start' | 'center' | 'end'
		resistance?: 'none' | 'normal' | 'futile'
		children?: Snippet
		closeOnClickOutside?: boolean
		class?: string
		style?: string
	}

	let { open = $bindable(false), closeOnClickOutside = true, ...props }: FloatingsheetProps = $props()

	let sait = $state(0)
	let saib = $state(0)
	let innerHeight = $state(0)

	let scrollContainer = $state<HTMLDivElement>()
	let dialogContainer = $state<HTMLDivElement>()
	let dialog = $state<HTMLDialogElement>()
	let offsetHeight = $state(0)
	let resistance = $derived(props.resistance || 'normal')
	let height = $derived.by(() => {
		switch (resistance) {
			case 'none':
				return `calc(200% - ${offsetHeight + sait + saib}px)`
			case 'futile':
				return '100%'
			case 'normal':
			default:
				return 'calc(100% + 1px)'
		}
	})

	function noscroll(node: HTMLElement) {
		// prevent scrolling on background
		function touchstart(e: TouchEvent) {
			if (e.target === dialogContainer) e.preventDefault()
		}
		node.addEventListener('touchstart', touchstart)
		return () => node.removeEventListener('touchstart', touchstart)
	}

	let startTime = 0
	function ontouchstart(e: TouchEvent) {
		startTime = performance.now()
	}

	let direction = $state('down')
	function ontouchend(e: TouchEvent) {
		const now = performance.now()
		if (now - startTime < 400) {
			if (closeOnClickOutside && e.target === e.currentTarget) {
				open = false
			}
		}
		// console.log(initialScrollTop, scrollContainer!.scrollTop)
		if (resistance === 'none') {
			switch (props.justify) {
				case 'start':
					if (scrollContainer!.scrollTop - initialScrollTop > 100) {
						open = false
						return
					}
					if (scrollContainer!.scrollTop < initialScrollTop) {
						return
					}
					break
				case 'end':
					if (initialScrollTop - scrollContainer!.scrollTop > 100) {
						open = false
						return
					}
					if (scrollContainer!.scrollTop > initialScrollTop) {
						return
					}
					break
				case 'center':
					if (Math.abs(scrollContainer!.scrollTop - initialScrollTop) > 100) {
						direction = scrollContainer!.scrollTop > initialScrollTop ? 'up' : 'down'
						open = false
						return
					}
					break
			}
			scrollContainer?.scrollTo({ top: initialScrollTop, behavior: 'smooth' })
		}
	}

	$effect(() => {
		if (!scrollContainer) return
		saib = parseInt(getComputedStyle(scrollContainer).getPropertyValue('--saib'))
		sait = parseInt(getComputedStyle(scrollContainer).getPropertyValue('--sait'))
	})

	let initialScrollTop = 0
	$effect(() => {
		if (!dialog) return
		if (resistance !== 'none') return
		requestAnimationFrame(() => {
			if (!scrollContainer) return
			const yAdjust = innerHeight - offsetHeight - sait - saib
			switch (props.justify) {
				case 'start':
					initialScrollTop = 0
					break
				case 'center':
					initialScrollTop = yAdjust / 2
					break
				case 'end':
					initialScrollTop = yAdjust
					break
			}
			scrollContainer.scrollTop = initialScrollTop
		})
	})

	let margins = {
		top: 0,
		bottom: 0
	}
	$effect(() => {
		if (!dialog) return
		const style = getComputedStyle(dialog)
		margins.top = parseInt(style.getPropertyValue('margin-top'))
		margins.bottom = parseInt(style.getPropertyValue('margin-bottom'))
	})

	let y = $derived(
		props.justify === 'start'
			? -offsetHeight - margins.top
			: props.justify === 'end'
				? offsetHeight + margins.top + margins.bottom
				: direction === 'up'
					? -(innerHeight + offsetHeight) / 2
					: (innerHeight + offsetHeight) / 2
	)
</script>

<svelte:window bind:innerHeight />

{#if open}
	<div transition:fade class="dialog-backdrop"></div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div bind:this={scrollContainer} class="scroll-container" {@attach noscroll}>
		<div bind:this={dialogContainer} class="dialog-container" style:justify-content={props.justify || 'end'} style:height {ontouchstart} {ontouchend}>
			<dialog
				open
				bind:this={dialog}
				bind:offsetHeight
				transition:fly={{
					opacity: 1,
					duration: 500,
					y: y
				}}
				class={props?.class}
				style={props?.style}
			>
				{@render props.children?.()}
			</dialog>
		</div>
	</div>
{/if}

<style>
	.scroll-container {
		color-scheme: light dark;
		--light: #fcfcfc;
		--dark: #222222;
		--fg: light-dark(var(--dark), var(--light));
		--bg: light-dark(var(--light), var(--dark));
		--sait: env(safe-area-inset-top);
		--saib: env(safe-area-inset-bottom);
		--sail: env(safe-area-inset-left);
		--sair: env(safe-area-inset-right);
		margin: 0;
		position: fixed;
		inset: 0;
		overflow-y: scroll;
		overscroll-behavior-y: contain;
		scrollbar-width: none;
		scrollbar-color: transparent transparent;
		-webkit-scrollbar: hidden;
		/* background: linear-gradient(rgba(0, 255, 0, 0.5), transparent); */
	}

	.dialog-container {
		display: flex;
		flex-direction: column;
		height: calc(100% + 1px);
		padding-left: calc(var(--sail) + 0.375rem);
		padding-right: calc(var(--sair) + 0.375rem);
		/* background-color: #0f07; */
	}

	dialog {
		position: relative;
		overflow: clip;
		width: 100%;
		max-width: 48rem;
		margin-inline: auto;
		padding: 0rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		background-color: var(--bg);
		color: var(--fg);
		border-radius: 2rem;
		margin-top: calc(var(--sait) + 0.375rem);
		margin-bottom: calc(var(--saib) + 0.375rem);
	}

	.dialog-backdrop {
		margin: 0;
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
