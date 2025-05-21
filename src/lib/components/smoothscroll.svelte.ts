import { quintOut } from 'svelte/easing'
import { Tween } from 'svelte/motion'

export function useSmoothScroll() {
	let node: HTMLElement
	let progress = new Tween(0)
	return {
		smoothScroll(element: HTMLElement) {
			node = element
			$effect(() => {
				node.scrollTop = progress.current
			})
		},
		smoothScrollTo(scrollTop: number, duration = 500, easing = quintOut) {
			node?.style.setProperty('overflow-y', 'hidden')
			setTimeout(() => {
				node?.style.setProperty('overflow-y', 'scroll')
				progress.set(node.scrollTop, { duration: 0 })
				progress.set(scrollTop, { duration, easing })
			}, 0)
		}
	}
}
