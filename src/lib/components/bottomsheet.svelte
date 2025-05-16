<script module lang="ts">
	import type { BottomsheetProps } from './types'
	import { untrack } from 'svelte'
	import { draggable, dyanamicDuration, escapeToClose } from './actions.svelte'
	import { noop, clamp } from './helpers'
	import { insets } from './device.svelte'
	import Snappoints from './snappoints.svelte'
	import './diaper.css'
	import './bottomsheet.css'
</script>

<script lang="ts">
	let {
		open = $bindable(false),
		maxHeight = '93%',
		height = maxHeight,
		snapPoints = [0, 1],
		initialIndex = 0,
		snapPoint1Content,
		snapPoint2Content,
		headerOverlaysContent = false,
		canDragSheet = true,
		stickyHeader = false,
		openSticky = false,
		closeOnBackdropTap = true,
		toggleOnHeaderTap = false,
		onclose = noop,
		onsnap = noop,
		header,
		children,
		flat = false,
		nonmodal = false,
		...props
	}: BottomsheetProps = $props()

	export function showModal() {
		open = true
	}

	export function close() {
		if (isTouching) return
		open = false
	}

	export function snapTo(index: number) {
		if (isTouching) return
		snapToIndex(index)
	}

	export function setIndex(index: number) {
		if (isTouching) return
		snapPointIndex = index
	}

	const refs = $state<Record<string, HTMLElement | undefined>>({
		ref: undefined,
		header: undefined,
		main: undefined,
		children: undefined,
		snapPoint1: undefined,
		snapPoint2: undefined
	})

	let isOpen = $state(false)
	let initialized = $state(false)
	let rendered = $state(false)
	let isMinimized = $state(false)
	let autoHeight = $state(height)
	let dialogHeight = $state(0)
	let snappoints = new Snappoints()
	let snapPointIndex = $state(initialIndex)
	let headerHeight = $derived(refs.header?.offsetHeight ?? 0)
	let mainHeight = $derived(dialogHeight - (headerOverlaysContent ? 0 : headerHeight))

	let dialog: HTMLDialogElement
	let backgroundElement: HTMLElement
	let isTouching = false
	let headerSnappoint = 0

	const saib = insets.bottom
	const isTouchingHeader = (target: HTMLElement) => refs.header!.contains(target)

	function snapToIndex(index: number) {
		// translate 16px more when the dialog is closing to
		// prevent box-shadow jumping at end of transition
		const translateMore = index < 0 ? 16 : 0
		if (index < 0) index = snappoints.lastIndex
		snapPointIndex = snappoints.clampIndex(index)
		const snapPoint = snappoints.at(snapPointIndex)
		onsnap?.(snapPoint)
		const translateY = snapPoint * dialogHeight
		dialog.style.setProperty('translate', `0 ${translateY + translateMore}px`)
		const progress = clamp(snapPoint / snappoints.at(1), 0, 1)
		applyProgress(progress)
		open = snapPoint !== 1
	}

	function handleClose() {
		dialog.close()
		open = false
		isOpen = false
		snapPointIndex = initialIndex
		initialized = false
		rendered = false
		if (backgroundElement === document.body) {
			document.body.style.setProperty('overflow', 'visible')
		}
		onclose?.()
	}

	function applyProgress(progress: number) {
		dialog.style.setProperty('--diaper-backdrop-progress', `${progress}`)
		if (flat) return
		// only scale body or dialog underneath if drag is between full and the first snap point
		if (backgroundElement === document.body) {
			if (height === maxHeight) backgroundElement.style.setProperty('--diaper-progress', `${progress}`)
		} else {
			backgroundElement.style.setProperty('--diaper-progress', `${progress}`)
		}
	}

	function onmovestart(e: CustomEvent) {
		isTouching = true
		if (!open) e.preventDefault() // it's closing!
		const isHeader = isTouchingHeader(e.detail.target)
		if (!canDragSheet && !isHeader) e.preventDefault()
		if (refs.children?.scrollTop !== 0 && !isHeader) e.preventDefault()
	}

	function onmove(e: CustomEvent) {
		const translateY = e.detail.translateY
		snapPointIndex = snappoints.indexOfNearest(translateY / dialogHeight)
		applyProgress(clamp(translateY / (dialogHeight * snappoints.at(1)), 0, 1))
	}

	function onmoveend(e: CustomEvent) {
		const deltaY = e.detail.deltaY
		snapPointIndex += deltaY > 20 ? 2 : deltaY > 5 ? 1 : deltaY < -5 ? -1 : 0
		snapPointIndex = Math.max(snapPointIndex, 0)
		snapToIndex(snapPointIndex)
		isTouching = false
	}

	function handleHeaderClick(e: MouseEvent) {
		if (!toggleOnHeaderTap) return
		if (!stickyHeader) {
			close()
			return
		}
		// ignore clicks on focusable child elements, e.g. the close button.
		// Buttons in iOS are not considered focusable so attempt to focus
		// the target first. Obviously won't focus a non-focusable element
		if (e.target !== e.currentTarget) (e.target as HTMLElement).focus()
		if ((e.currentTarget as HTMLElement).contains(document.activeElement)) return
		const headerIndex = snappoints.indexOf(headerSnappoint)
		if (isMinimized) {
			snapToIndex(initialIndex !== headerIndex ? initialIndex : 0)
		} else {
			snapToIndex(headerIndex)
		}
	}

	function calcAutoSnapPoint(ref: HTMLElement | undefined) {
		if (!ref) return 0
		return clamp((mainHeight - ref.offsetHeight) / dialogHeight, 0, 1)
	}

	function calcSnapPoints(snapPoints: number[] | 'auto') {
		let snappoints = [0, 1]
		if (snapPoints === 'auto') {
			const sp0 = snapPoint1Content || snapPoint2Content ? 0 : calcAutoSnapPoint(refs.children)
			const sp1 = snapPoint1Content ? calcAutoSnapPoint(refs.snapPoint1) : 0
			const sp2 = snapPoint2Content ? calcAutoSnapPoint(refs.snapPoint2) : 0
			snappoints.push(sp0, sp1, sp2)
		} else {
			snappoints.push(...snapPoints)
		}
		if (stickyHeader) {
			headerSnappoint = 1 - (headerHeight + saib) / dialogHeight
			snappoints.push(headerSnappoint)
		}
		return [...new Set(snappoints)].sort((a, b) => a - b)
	}

	function onclick(e: MouseEvent) {
		if (closeOnBackdropTap && e.target === e.currentTarget) close()
	}

	// Effect 1 - open logic
	$effect(() => {
		if (open) isOpen = true
		else if (isOpen) snapToIndex(-1)
	})

	// Effect 3 - show
	$effect(() => {
		if (!refs.ref) return
		document.body.style.setProperty('overflow', 'hidden')
		dialog = refs.ref as HTMLDialogElement
		const dialogs = [...document.querySelectorAll('dialog')]
		dialog.close()
		if (stickyHeader && isMinimized && dialogs.length < 2) {
			dialog.show()
		} else {
			dialog.showModal()
		}
		dialogHeight = dialog.offsetHeight
		backgroundElement = dialogs.at(-2) ?? document.body
		initialized = true
	})

	// Effect 4 - autoheight
	$effect(() => {
		if (!refs.children) return
		rendered = true
		if (height !== 'auto') return
		const offsetHeight = refs.children.offsetHeight + (headerOverlaysContent ? 0 : headerHeight)
		dialogHeight = offsetHeight
		autoHeight = `${offsetHeight}px`
	})

	// Effect 5 - calc snappoints
	$effect(() => {
		if (!rendered) return
		snappoints.set(calcSnapPoints(snapPoints))
		untrack(() => snapToIndex(stickyHeader && openSticky ? snappoints.indexOf(headerSnappoint) : (initialIndex ?? 0)))
	})

	// Effect 7 - minimize observer
	$effect(() => {
		if (!rendered) return
		let first = true
		const observer = new IntersectionObserver(
			(entries) => {
				if (first) return (first = false)
				const ratio = entries[0].intersectionRatio
				isMinimized = ratio <= 1 - headerSnappoint
				if (ratio <= 0) handleClose()
			},
			{ threshold: snappoints.invert(), root: null, rootMargin: `0px 0px -${saib + 1}px 0px` }
		)
		observer.observe(dialog)
		return () => observer.disconnect()
	})

	function ontransitionend(e: TransitionEvent) {
		if (e.propertyName !== 'translate') return
		dialog.close()
		const nonmodalAtIndex = nonmodal === true ? 0 : -1
		if (snapPointIndex >= nonmodalAtIndex) {
			if (snapPointIndex === 0 && height === maxHeight) dialog.showModal()
			else dialog.show()
		} else {
			dialog.showModal()
		}
	}
</script>

{#if isOpen}
	<dialog
		data-diaper
		bind:this={refs.ref}
		class={props?.class}
		style:height={autoHeight}
		style:max-height={maxHeight}
		style={props?.style}
		{onclick}
		{onmovestart}
		{onmove}
		{onmoveend}
		{ontransitionend}
		use:draggable
		use:dyanamicDuration
		use:escapeToClose={close}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<header bind:this={refs.header} class:headerOverlaysContent onclick={handleHeaderClick}>
			{#if header}
				{@render header?.()}
			{:else}
				<div style:padding-block="8px">
					<div class="handle"></div>
				</div>
			{/if}
		</header>
		<main bind:this={refs.main} style:max-height="{mainHeight}px">
			{#if initialized}
				{@const paddingTop = headerOverlaysContent ? headerHeight : 0}
				<!-- style:max-height="{mainHeight}px" is needed to make iOS scrollable -->
				<section
					bind:this={refs.children}
					data-visible={snapPointIndex === 0 || (snapPointIndex === 1 && !snapPoint1Content) || (snapPointIndex === 2 && !snapPoint2Content) || null}
					style:overflow="auto"
					style:height={height === 'auto' || snapPoints === 'auto' ? 'fit-content' : '100%'}
					style:max-height="{mainHeight}px"
					style:padding-top="{paddingTop}px"
					style:padding-bottom={children ? saib + 'px' : 0}
				>
					{@render children?.()}
				</section>
				<section
					bind:this={refs.snapPoint1}
					data-visible={snapPointIndex === 1 || null}
					style:overflow="auto"
					style:padding-top="{paddingTop}px"
					style:padding-bottom={snapPoint1Content ? saib + 'px' : 0}
				>
					{@render snapPoint1Content?.()}
				</section>
				<section
					bind:this={refs.snapPoint2}
					data-visible={snapPointIndex === 2 || null}
					style:overflow="auto"
					style:padding-top="{paddingTop}px"
					style:padding-bottom={snapPoint2Content ? saib + 'px' : 0}
				>
					{@render snapPoint2Content?.()}
				</section>
			{/if}
		</main>
	</dialog>
{/if}

<style>
	main {
		display: grid;
		grid-template-areas: 'content';
		height: 100%;
	}
	section {
		grid-area: content;
		transition-property: opacity, visibility;
		transition-duration: 0.9s;
		transition-behavior: allow-discrete;
		visibility: hidden;
		opacity: 0;
		&[data-visible] {
			visibility: visible;
			opacity: 1;
		}
		height: fit-content;
		max-height: 100%;
	}
	.handle {
		width: 52px;
		height: 6px;
		background-color: #aaa7;
		border-radius: 3px;
		margin-inline: auto;
	}
	.headerOverlaysContent {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		backdrop-filter: blur(8px);
	}
</style>
