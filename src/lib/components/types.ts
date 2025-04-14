import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

export type BottomsheetProps = {
	open?: boolean
	maxHeight?: string
	height?: string
	snapPoints?: number[] | 'auto'
	initialSnapPoint?: number
	snapPoint1Content?: Snippet
	snapPoint2Content?: Snippet
	onclose?: () => void
	onsnap?: (progress: number) => void
	header?: Snippet
	children?: Snippet
} & HTMLAttributes<HTMLDialogElement>
