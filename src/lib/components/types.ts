import type { Snippet } from 'svelte'

export type BottomsheetProps = {
	open?: boolean
	maxHeight?: string
	height?: string
	snapPoints?: number[] | 'auto'
	initialIndex?: number
	snapPoint1Content?: Snippet
	snapPoint2Content?: Snippet
	headerOverlaysContent?: boolean
	canDragSheet?: boolean
	stickyHeader?: boolean
	openSticky?: boolean
	closeOnBackdropTap?: boolean
	toggleOnHeaderTap?: boolean
	flat?: boolean
	nonmodal: boolean | number
	onclose?: () => void
	onsnap?: (progress: number) => void
	header?: Snippet
	children?: Snippet
	class?: string
	style?: string
}

export type LongsheetProps = {
	open?: boolean
	children?: Snippet
	class?: string
	style?: string
}
