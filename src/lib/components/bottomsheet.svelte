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
		initialSnapPoint = 0,
		snapPoint1Content,
		snapPoint2Content,
		headerOverlaysContent = false,
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
	let mainHeight = $derived(dialogHeight - headerHeight)
	let newTranslate = $state(0)
	let snapPointIndex = $state(initialSnapPoint)

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
			snapPointIndex = initialSnapPoint
			newTranslate = 0
			hasRendered = false
		})
	}

	function ontouchstart(e: TouchEvent) {
		if (refs.main!.scrollTop !== 0 && !refs.header!.contains(e.target as HTMLElement)) return
		if (isTransitioning) return
		startY = e.touches[0].clientY
		isTouching = true
		setRootProperty('--duration', '0s')
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

	function ontouchend(e) {
		setRootProperty('--duration', duration)
		// if (newTranslate === 0) return
		if (!isTouching) return
		snapToIndex(snapPointIndex)
		startY = 0
		isTouching = false
	}

	function applyProgress(progress: number) {
		dialog.style.setProperty('--backdrop-opacity', `${(1 - progress) * backdropOpacity}`)
		// only scale body or dialog underneath if drag is between full and the first snap point
		if (height === maxHeight) backgroundElement.style.setProperty('--progress', `${progress}`)
	}

	const calcAutoSnapPoint = (ref: HTMLElement | undefined) => (ref ? clamp((mainHeight - ref.offsetHeight) / dialogHeight, 0, 1) : 0)

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
		snappoints = calcSnapPoints(snapPoints)
		hasRendered = true
		onTransitionend(() => {
			dialogHeight = dialog.offsetHeight
			isTransitioning = false
		})
		backgroundElement = [...document.querySelectorAll('dialog')].at(-2) ?? document.body
		snapToIndex(initialSnapPoint)
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
			duration = getRootProperty('--duration')
			backdropOpacity = +getRootProperty('--backdrop-opacity')
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
		autoHeight = refs.main.offsetHeight + headerHeight + 'px'
	})
</script>

{#if isOpen}
	<dialog
		bind:this={refs.ref}
		style:height={autoHeight}
		style:max-height={maxHeight}
		class={props?.class}
		style={props?.style}
		use:scrollRestore={{ scrollElement: refs.children, snapPointIndex }}
	>
		<header bind:this={refs.header} {ontouchstart} {ontouchmove} {ontouchend} class={headerOverlaysContent ? 'absolute top-0 w-full backdrop-blur-sm' : ''}>
			{#if header}
				{@render header?.()}
			{:else}
				<div class="handle"></div>
			{/if}
		</header>
		<main bind:this={refs.main} style:max-height={(headerOverlaysContent ? dialogHeight : mainHeight) - newTranslate + 'px'}>
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
	</dialog>
{/if}

<style>
	main {
		display: grid;
		grid-template-areas: 'content';
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
</style>
