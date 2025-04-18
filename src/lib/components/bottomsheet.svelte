<script module lang="ts">
	import type { BottomsheetProps } from './types'
	import { untrack } from 'svelte'
	import './bottomsheet.css'
	import { fade } from 'svelte/transition'

	const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

	const getNearestValue = (value: any, array: any[]) =>
		array.reduce((nearest, current) => (Math.abs(value - current) < Math.abs(value - nearest) ? current : nearest), array[0])

	const getRootProperty = (property: string) => getComputedStyle(document.documentElement).getPropertyValue(property)
	const setRootProperty = (property: string, value: string) => document.documentElement.style.setProperty(property, value)

	function indexOf(value: any, array: any[] = [], indexIfNotFound = -1) {
		const index = array.indexOf(value)
		return index > -1 ? index : indexIfNotFound
	}

	function scrollRestore(node: HTMLElement, { scrollElement, snapPointIndex }: { scrollElement: HTMLElement | undefined; snapPointIndex: number }) {
		let scrollTop = 0
		let prevIndex = 0
		return {
			update({ scrollElement, snapPointIndex }: { scrollElement: HTMLElement | undefined; snapPointIndex: number }) {
				if (!scrollElement) return
				$effect(() => {
					if (snapPointIndex > 0) {
						if (prevIndex === 0) {
							scrollTop = scrollElement.scrollTop
						}
					} else {
						// Timeout only seems to be needed with tailwind
						setTimeout(() => (scrollElement.scrollTop = scrollTop), 10)
					}
					prevIndex = snapPointIndex
				})
			}
		}
	}
</script>

<script lang="ts">
	let {
		open = $bindable(true),
		maxHeight = '93%',
		height = maxHeight,
		snapPoints = [],
		initialIndex = 0,
		snapPoint1Content,
		snapPoint2Content,
		headerOverlaysContent = false,
		canDragSheet = true,
		onclose = () => {},
		onsnap = () => {},
		header,
		children,
		...props
	}: BottomsheetProps = $props()

	export function close() {
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

	function snapToIndex(index: number) {
		if (index < 0) index = snappoints.length - 1
		snapPointIndex = clamp(index, 0, snappoints.length - 1)
		const snapPoint = snappoints[snapPointIndex]
		onsnap?.(snapPoint)
		if (snapPoint === 1) {
			close()
			return
		}
		lastTranslate = snapPoint * dialogHeight
		if (newTranslate > lastTranslate) {
			newTranslate = lastTranslate
		} else {
			onTransitionend(() => (newTranslate = lastTranslate))
		}
		dialog.style.setProperty('translate', `0 ${lastTranslate}px`)
		const progress = clamp(snapPoint / snappoints[1], 0, 1)
		applyProgress(progress)
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
	let hasRendered = $state(false)
	let autoHeight = $state(height)
	let dialogHeight = $state(0)
	let headerHeight = $state(0)
	let mainHeight = $state(0)
	let newTranslate = $state(0)
	let snapPointIndex = $state(initialIndex)

	let snappoints: number[] = []
	let dialog: HTMLDialogElement
	let backgroundElement: HTMLElement
	let startY = 0
	let lastTranslate = 0
	let isTouching = false
	let isTransitioning = true
	let duration = '0.5s'
	let backdropOpacity = 0.25

	const getSnapPointIndex = (value: number) => indexOf(value, snappoints, 0)
	const getNearestSnapPoint = (value: number) => getNearestValue(value, snappoints)
	const onTransitionend = (callback: () => void) => dialog.addEventListener('transitionend', callback, { once: true })

	function doClose() {
		dialog.style.setProperty('translate', '0 100%')
		applyProgress(1)
		isTransitioning = true
		onTransitionend(() => {
			dialog.close()
			open = false
			isOpen = false
			onclose?.()
			if (backgroundElement === document.body) {
				document.body.style.setProperty('overflow', 'visible')
			}
			isTransitioning = false
			snapPointIndex = initialIndex
			newTranslate = 0
			hasRendered = false
		})
	}

	const isTouchingHeader = (target: HTMLElement) => refs.header!.contains(target)
	const canDragSheetOverride = snapPoint1Content || snapPoint2Content ? false : canDragSheet

	function ontouchstart(e: TouchEvent) {
		const isHeader = isTouchingHeader(e.target as HTMLElement)
		if (!canDragSheetOverride && !isHeader) return
		if (refs.children?.scrollTop !== 0 && !isHeader) return
		if (isTransitioning) return
		startY = e.touches[0].clientY
		isTouching = true
		setRootProperty('--diaper-duration', '0s')
	}

	function ontouchmove(e: TouchEvent) {
		if (startY === 0) return
		if (!isTouching) return
		newTranslate = lastTranslate + e.touches[0].clientY - startY
		if (newTranslate > 0) {
			dialog.style.setProperty('translate', `0 ${newTranslate}px`)
		}
		// setting snapPointIndex here causes content to change on drag.
		// can alternatively be done in ontouchend
		const snapPoint = getNearestSnapPoint(newTranslate / dialogHeight)
		snapPointIndex = getSnapPointIndex(snapPoint)
		const progress = clamp(newTranslate / (dialogHeight * snappoints[1]), 0, 1)
		applyProgress(progress)
	}

	function ontouchend() {
		setRootProperty('--diaper-duration', duration)
		// if (newTranslate === 0) return
		if (!isTouching) return
		snapToIndex(snapPointIndex)
		startY = 0
		isTouching = false
	}

	function applyProgress(progress: number) {
		dialog.style.setProperty('--diaper-backdrop-opacity', `${(1 - progress) * backdropOpacity}`)
		// only scale body or dialog underneath if drag is between full and the first snap point
		if (height === maxHeight) backgroundElement.style.setProperty('--diaper-progress', `${progress}`)
	}

	const calcAutoSnapPoint = (ref: HTMLElement | undefined) => {
		if (!ref) return 0
		const contentHeight = headerOverlaysContent ? mainHeight - headerHeight : mainHeight
		return clamp((contentHeight - ref.offsetHeight) / dialogHeight, 0, 1)
	}

	function calcSnapPoints(snapPoints: number[] | 'auto') {
		let snappoints = [0, 1]
		if (snapPoints === 'auto') {
			const sp0 = refs.snapPoint1 || refs.snapPoint2 ? 0 : calcAutoSnapPoint(refs.children)
			const sp1 = calcAutoSnapPoint(refs.snapPoint1)
			const sp2 = calcAutoSnapPoint(refs.snapPoint2)
			snappoints.push(sp0, sp1, sp2)
		} else {
			snappoints.push(...snapPoints)
		}
		return [...new Set(snappoints)].sort((a, b) => a - b)
	}

	function init() {
		dialogHeight = dialog.offsetHeight
		headerHeight = refs.header?.offsetHeight ?? 0
		if (!mainHeight) {
			mainHeight = headerOverlaysContent ? dialogHeight : dialogHeight - headerHeight
		}
		snappoints = calcSnapPoints(snapPoints)
		hasRendered = true
		onTransitionend(() => {
			dialogHeight = dialog.offsetHeight
			isTransitioning = false
		})
		backgroundElement = [...document.querySelectorAll('dialog')].at(-2) ?? document.body
		snapToIndex(initialIndex)
	}

	$effect(() => {
		if (open) {
			isOpen = true
			startY = 0
			lastTranslate = 0
		} else {
			if (isOpen) doClose()
		}
	})

	$effect(() => {
		if (!refs.ref) return
		requestAnimationFrame(() => {
			duration = getRootProperty('--diaper-duration')
			backdropOpacity = +getRootProperty('--diaper-backdrop-opacity')
		})
		document.body.style.setProperty('overflow', 'hidden')
		dialog = refs.ref as HTMLDialogElement
		dialog.showModal()
		untrack(init)
	})

	$effect(() => {
		if (height !== 'auto') return
		if (!refs.children) return
		if (!refs.main) return
		autoHeight = refs.main.offsetHeight + 'px'
	})
</script>

{#if isOpen}
	<dialog
		data-diaper
		bind:this={refs.ref}
		style:height={autoHeight}
		style:max-height={maxHeight}
		use:scrollRestore={{ scrollElement: refs.children, snapPointIndex }}
	>
		<div class={props?.class} style={props?.style} style:flex="1" {ontouchstart} {ontouchmove} {ontouchend}>
			<header bind:this={refs.header} class:headerOverlaysContent>
				{#if header}
					{@render header?.()}
				{:else}
					<div class="handle"></div>
				{/if}
			</header>
			<main bind:this={refs.main} style:max-height={mainHeight - newTranslate + 'px'}>
				{#if !hasRendered}
					{#if children}
						<section bind:this={refs.children} class="h-fit">
							{@render children()}
						</section>
					{/if}
					{#if snapPoint1Content}
						<section bind:this={refs.snapPoint1} class="h-fit">
							{@render snapPoint1Content()}
						</section>
					{/if}
					{#if snapPoint2Content}
						<section bind:this={refs.snapPoint2} class="h-fit">
							{@render snapPoint2Content()}
						</section>
					{/if}
				{:else}
					<!--  -->
					{#if snapPointIndex === 1 && snapPoint1Content}
						<section transition:fade style="overflow:auto;" style:padding-top={headerOverlaysContent ? headerHeight + 'px' : 0}>
							{@render snapPoint1Content()}
						</section>
					{:else if snapPointIndex > 1 && snapPoint2Content}
						<section transition:fade style="overflow:auto;" style:padding-top={headerOverlaysContent ? headerHeight + 'px' : 0}>
							{@render snapPoint2Content()}
						</section>
					{:else if children}
						<section bind:this={refs.children} transition:fade style="overflow:auto;" style:padding-top={headerOverlaysContent ? headerHeight + 'px' : 0}>
							{@render children()}
						</section>
					{/if}
					<!--  -->
				{/if}
			</main>
		</div>
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
	}
	.h-fit {
		height: fit-content;
	}
	.handle {
		width: 40px;
		height: 4px;
		background-color: #e0e0e0;
		border-radius: 2px;
		margin: 16px auto;
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
