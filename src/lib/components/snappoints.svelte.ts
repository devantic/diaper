import { clamp, getNearestValue, indexOf } from './helpers'

export default class Snappoints {
	values = $state.raw([0, 1])

	set(values: number[]) {
		this.values = values
	}

	get length() {
		return this.values.length
	}

	at(index: number) {
		return this.values[index]
	}

	indexOf(value: number) {
		return indexOf(value, this.values, 0)
	}

	get lastIndex() {
		return this.values.length - 1
	}

	clampIndex(index: number) {
		return clamp(index, 0, this.values.length - 1)
	}

	nearest(value: number) {
		return getNearestValue(value, this.values)
	}

	indexOfNearest(value: number) {
		return this.indexOf(this.nearest(value))
	}

	invert() {
		return this.values.map((p) => 1 - p)
	}
}
