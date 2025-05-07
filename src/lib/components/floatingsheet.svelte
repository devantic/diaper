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

	let dialog = $state<HTMLDialogElement>()
	let scrollContainer = $state<HTMLDivElement>()
	let offsetHeight = $state(0)
	let translate = $state(0)
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
			if (e.target === e.currentTarget) e.preventDefault()
		}
		$effect(() => {
			node.addEventListener('touchstart', touchstart)
			return () => node.removeEventListener('touchstart', touchstart)
		})
	}

	function handleContainerClick(e: MouseEvent) {
		if (closeOnClickOutside && e.target === e.currentTarget) {
			open = false
		}
	}

	$effect(() => {
		if (!scrollContainer) return
		saib = parseInt(getComputedStyle(scrollContainer).getPropertyValue('--saib'))
		sait = parseInt(getComputedStyle(scrollContainer).getPropertyValue('--sait'))
	})

	$effect(() => {
		if (!dialog) return
		if (resistance !== 'none') return
		requestAnimationFrame(() => {
			if (!scrollContainer) return
			const yAdjust = innerHeight - offsetHeight - sait - saib
			switch (props.justify) {
				case 'start':
					scrollContainer.scrollTop = yAdjust
					translate = yAdjust
					break
				case 'center':
					scrollContainer.scrollTop = yAdjust / 2
					translate = 0
					break
				default: // end
					scrollContainer.scrollTop = 0
					translate = -yAdjust
					break
			}
		})
	})

	$effect(() => {
		if (!open) translate = 0
	})
</script>

<svelte:window bind:innerHeight />

{#if open}
	<div transition:fade class="dialog-backdrop"></div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div bind:this={scrollContainer} class="scroll-container" use:noscroll>
		<div class="dialog-container" style:justify-content={props.justify || 'end'} style:height onclick={handleContainerClick}>
			<dialog
				bind:this={dialog}
				bind:offsetHeight
				open
				transition:fly={{ y: props.justify === 'start' ? -innerHeight / 2 : innerHeight / 2, opacity: 0 }}
				class={props?.class}
				style={props?.style}
				use:noscroll
				style:translate="0 {translate}px"
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
