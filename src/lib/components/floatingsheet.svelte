<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fade, fly } from 'svelte/transition'

	type FloatingsheetProps = {
		open?: boolean
		justify?: 'start' | 'center' | 'end'
		resistance?: 'none' | 'normal' | 'full'
		children?: Snippet
		class?: string
		style?: string
	}

	let { open = $bindable(false), ...props }: FloatingsheetProps = $props()

	let isTouching = false
	function ontouchstart() {
		isTouching = true
	}

	function ontouchend() {
		isTouching = false
		scrollTop = scrollContainer!.scrollTop
		if (scrollTop < -100) {
			open = false
		}
	}

	function noscroll(node: HTMLElement) {
		function touchstart(e: TouchEvent) {
			if (e.target === e.currentTarget) e.preventDefault()
		}
		$effect(() => {
			node.addEventListener('touchstart', touchstart)
			return () => node.removeEventListener('touchstart', touchstart)
		})
	}

	let scrollTop = $state(0)
	function onscroll(e: Event) {
		// return
		scrollTop = scrollContainer!.scrollTop
		if (scrollTop < -100 && !isTouching) {
			open = false
		}
	}

	let dialog = $state<HTMLDialogElement>()
	let scrollContainer = $state<HTMLDivElement>()
	let offsetHeight = $state(0)
	let translate = $state(0)

	let resistance = $derived(props.resistance || 'normal')

	let height = $derived.by(() => {
		switch (resistance) {
			case 'none':
				return `calc(100% + ${offsetHeight / 2}px)`
			case 'normal':
				return 'calc(100% + 1px)'
			case 'full':
				return '100%'
		}
	})

	$effect(() => {
		if (!scrollContainer) return
		if (resistance !== 'none') return
		requestAnimationFrame(() => {
			if (!scrollContainer) return
			const yAdjust = offsetHeight / 2
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
	let innerHeight = $state(0)
	let y = $derived(innerHeight)

	$effect.pre(() => {
		if (!dialog) return
		const bcr = dialog.getBoundingClientRect()
		y = innerHeight - bcr.top
	})

	$inspect({ offsetHeight, innerHeight })
</script>

<svelte:window bind:innerHeight />

{#if open}
	<div class="fixed top-16 left-4 p-2 bg-black text-white">{scrollTop}</div>
	<div transition:fade class="dialog-backdrop"></div>
	<div bind:this={scrollContainer} class="scroll-container" {onscroll} use:noscroll>
		<div class="dialog-container" style:justify-content={props.justify || 'end'} style:height>
			<dialog
				bind:this={dialog}
				bind:offsetHeight
				open
				transition:fly={{ y, opacity: 1 }}
				{ontouchstart}
				{ontouchend}
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
	:global(:root) {
	}
	dialog {
		color-scheme: light dark;
		--light: #fcfcfc;
		--dark: #222222;
		--fg: light-dark(var(--dark), var(--light));
		--bg: light-dark(var(--light), var(--dark));
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
		translate: 0 -224px;
	}

	.dialog-container {
		--sait: env(safe-area-inset-top);
		--saib: env(safe-area-inset-bottom);
		--sail: env(safe-area-inset-left);
		--sair: env(safe-area-inset-right);
		display: flex;
		flex-direction: column;
		height: calc(100% + 1px);
		padding-top: calc(var(--sait) + 0.375rem);
		padding-bottom: calc(var(--saib) + 0.375rem);
		padding-left: calc(var(--sail) + 0.375rem);
		padding-right: calc(var(--sair) + 0.375rem);
		/* padding-bottom: var(--saib); */
	}
	.scroll-container {
		margin: 0;
		position: fixed;
		inset: 0;
		overflow-y: scroll;
		scrollbar-width: none;
		scrollbar-color: transparent transparent;
		-webkit-scrollbar: hidden;
		/* background: linear-gradient(rgba(0, 255, 0, 0.5), transparent); */
	}
	.dialog-backdrop {
		margin: 0;
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
