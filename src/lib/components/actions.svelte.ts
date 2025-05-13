import type { ActionReturn } from 'svelte/action'
import { getRootProperty, setRootProperty } from './helpers'

interface Parameter {}
interface Attributes {
	onmovestart: (e: CustomEvent<'movestart'>) => void
	onmove: (e: CustomEvent<'move'>) => void
	onmoveend: (e: CustomEvent<'moveend'>) => void
}

const setDuration = (duration: string) => setRootProperty('--diaper-duration', duration)

export function dyanamicDuration(node: HTMLElement) {
	const HISTORY_MS = 100
	let diaperDuration = '0.4s'
	let touchHistory: { y: number; time: number }[] = []
	let dialog = node.parentElement!

	const touchstart = () => {
		clearAll()
		setDuration('0s')
	}
	const touchmove = (e: TouchEvent) => {
		push(e.touches[0].clientY)
		setDuration('0s')
	}
	const touchend = () => {
		setDuration(calcDyanamicDuration())
	}

	$effect(() => {
		diaperDuration = getRootProperty('--diaper-default-duration')
		setDuration(diaperDuration)

		dialog.addEventListener('touchstart', touchstart)
		dialog.addEventListener('touchmove', touchmove)
		dialog.addEventListener('touchend', touchend)
		return () => {
			dialog.removeEventListener('touchstart', touchstart)
			dialog.removeEventListener('touchmove', touchmove)
			dialog.removeEventListener('touchend', touchend)
		}
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
	function calcDyanamicDuration(): string {
		clearOld()
		if (touchHistory.length >= 2) {
			const first = touchHistory.at(0)!
			const last = touchHistory.at(-1)!
			const deltaY = last.y - first.y
			const deltaTime = last.time - first.time
			const speed = Math.abs(deltaY / deltaTime) // px/ms

			// console.log({ deltaTime, speed })
			// Map speed to transition duration
			// Faster swipe = shorter duration
			const maxSpeed = 2 // px/ms
			const minDuration = 400 // ms
			const maxDuration = 1400 // ms

			let dyanamicDuration = maxDuration - (speed / maxSpeed) * (maxDuration - minDuration)
			dyanamicDuration = Math.max(minDuration, Math.min(maxDuration, dyanamicDuration)) // clamp

			return dyanamicDuration + 'ms'
		}
		return diaperDuration
	}
}

export function draggable(node: HTMLElement): ActionReturn<Parameter, Attributes> {
	let startY = 0
	let lastY = 0
	let currentY = 0
	let translateY = 0
	let deltaY = 0
	let isTouching = false
	let dialog = node.parentElement!

	function ontouchstart(e: TouchEvent) {
		startY = 0
		currentY = 0
		translateY = 0
		// ignore multiple touches
		if (isTouching) return

		const event = new CustomEvent('movestart', { detail: { target: e.target as HTMLElement }, cancelable: true })
		if (!node.dispatchEvent(event)) return

		currentY = dialog.getBoundingClientRect().top - dialog.offsetTop

		startY = e.touches[0].clientY
		isTouching = true
	}

	function ontouchmove(e: TouchEvent) {
		if (startY === 0) return
		if (!isTouching) return

		const clientY = e.touches[0].clientY
		deltaY = clientY - lastY
		lastY = clientY

		// Prevent touch loss when dragging off bottom edge of screen
		if (clientY > screen.height) return

		translateY = currentY + clientY - startY

		// overdrag resistance
		if (translateY < 0) {
			translateY = Math.pow(Math.abs(translateY), 0.5) * Math.sign(translateY)
		}

		dialog.style.setProperty('translate', `0 ${translateY}px`)

		const event = new CustomEvent('move', { detail: { translateY, deltaY } })
		node.dispatchEvent(event)
	}

	function ontouchend(e: TouchEvent) {
		// if multiple fingers touching, do nothing until last finger is released
		if (e.touches.length > 0) return

		// if (translateY === 0) return
		if (!isTouching) return
		const event = new CustomEvent('moveend', { detail: { translateY, deltaY } })
		node.dispatchEvent(event)
		isTouching = false
	}

	$effect(() => {
		node.addEventListener('touchstart', ontouchstart)
		node.addEventListener('touchmove', ontouchmove)
		node.addEventListener('touchend', ontouchend)
		return () => {
			node.removeEventListener('touchstart', ontouchstart)
			node.removeEventListener('touchmove', ontouchmove)
			node.removeEventListener('touchend', ontouchend)
		}
	})
	return {}
}
