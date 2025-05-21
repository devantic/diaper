export function customClick(onclick: () => void) {
	return (element: HTMLElement) => {
		let startTime = 0
		function ontouchstart(e: TouchEvent) {
			startTime = performance.now()
		}
		function ontouchend(e: TouchEvent) {
			const now = performance.now()
			if (now - startTime < 400) {
				if (e.target === e.currentTarget) {
					onclick()
				}
			}
		}
		element.addEventListener('touchstart', ontouchstart)
		element.addEventListener('touchend', ontouchend)
		return () => {
			element.removeEventListener('touchstart', ontouchstart)
			element.removeEventListener('touchend', ontouchend)
		}
	}
}
