export function swipeMonitor(node: HTMLElement) {
	const HISTORY_MS = 100
	let touchHistory: { y: number; time: number }[] = []
	const ontouchstart = () => {
		clearAll()
	}
	const ontouchmove = (e: TouchEvent) => {
		push(e.touches[0].clientY)
	}
	const ontouchend = () => {
		node.dispatchEvent(new CustomEvent('swipe', { detail: calcSpeed() }))
	}

	function addEventListeners() {
		node.addEventListener('touchstart', ontouchstart)
		node.addEventListener('touchmove', ontouchmove)
		node.addEventListener('touchend', ontouchend)
	}

	function removeEventListeners() {
		node.removeEventListener('touchstart', ontouchstart)
		node.removeEventListener('touchmove', ontouchmove)
		node.removeEventListener('touchend', ontouchend)
	}

	$effect.pre(() => {
		addEventListeners()
		return removeEventListeners
	})

	function clearAll() {
		touchHistory = []
	}

	function clearOld() {
		const now = performance.now()
		for (let i = 0; i < touchHistory.length; i++) {
			if (now - touchHistory[i].time > HISTORY_MS) {
				touchHistory.splice(0, i)
				break
			}
		}
		// this.touchHistory = this.touchHistory.filter((point) => now - point.time <= this.HISTORY_MS)
	}

	function push(y: number) {
		clearOld()
		touchHistory.push({ y, time: performance.now() })
	}

	function calcSpeed() {
		clearOld()
		if (touchHistory.length >= 2) {
			const first = touchHistory.at(0)!
			const last = touchHistory.at(-1)!
			const deltaY = last.y - first.y
			const deltaTime = last.time - first.time
			const speed = deltaY / deltaTime // px/ms
			return speed
		}
		return 0
	}
}
