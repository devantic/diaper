![NPM Version](https://img.shields.io/npm/v/%40devantic%2Fdiaper?color=red)

# Version 2.0

- _**Breaking change:**_ no longer accepts `baseClass` prop. Use the `class` prop instead with the important (!) modifier for all tailwind classes.

- Added subtle overdrag resistance when dragging beyond max height

# Diaper

A advanced bottom sheet component for Svelte5

See the [demo.](https://diaperbs.vercel.app)

## Install

```sh
npm install @devantic/diaper
```

## Components

**`Bottomsheet`**

The main component.

```ts
import Bottomsheet from '@devantic/diaper'
```

\- or -

```ts
import { Bottomsheet } from '@devantic/diaper'
```

**`Detachedsheet`**

A convenience component - a thin wrapper around `Bottomsheet` with small margin and more rounded corners. Same props as Bottomsheet, but don't go nuts.

```ts
import { Detachedsheet } from '@devantic/diaper'
```

**`Fullsheet`**

A convenience component - a thin wrapper around `Bottomsheet` for sheets that cover the entire screen. Same props as Bottomsheet.

```ts
import { Fullsheet } from '@devantic/diaper'
```

**`Longsheet`**

For long content. The entire sheet scrolls in the viewport rather than just the content. Only needs the `open` prop.

```ts
import { Longsheet } from '@devantic/diaper'
```

## Usage

See the [code for the examples](https://github.com/devantic/diaper/tree/main/src/routes/examples) used in the demo.

## Types and Props

```ts
export type BottomsheetProps = {
	open?: boolean
	height?: string
	maxHeight?: string
	snapPoints?: number[] | 'auto'
	initialIndex?: number
	canDragSheet?: boolean
	headerOverlaysContent?: boolean
	stickyHeader?: boolean
	openSticky?: boolean
	toggleOnHeaderTap?: boolean
	closeOnBackdropTap?: boolean
	flat?: boolean
	nonmodal?: boolean | number
	onclose?: () => void
	onsnap?: (progress: number) => void
	header?: Snippet
	children?: Snippet
	snapPoint1Content?: Snippet
	snapPoint2Content?: Snippet
	class?: string
	style?: string
}

export type LongsheetProps = {
	open?: boolean
	children?: Snippet
	class?: string
	style?: string
}
```

**`open` - optional, bindable**

A boolean value controlling the open/closed state of the bottom sheet. You can `bind:open` to it which is the prefered method of control. Or you can `bind:this` to the component instance and control it using the `showModal()` or `show()`, and `close()` methods - see [Programmatic Control](#programmatic-control)

**`height` - optional**

A string specifying the the height of the dialog. Defaults to maxHeight (93% of view height). Values can be specified using any valid css unit, e.g. `'75%'`, `'75vh'`, `'400px'`, etc. A value of `'auto'` will auto-size the sheet to fit content.

**`maxHeight` - optional**

Overrides the maxHeight of the sheet, defaults to 93% of the view height to accommodate the 3D stacked sheets effect. It is not recommended to change this unless you want a full screen sheet for example. Accepts any valid css unit like the `height` prop

**`snapPoints` - optional**

Accepts an array of numbers between 0 and 1 or the string value `'auto'`. E.g. `[0.25, 0.5, 0.75]`. Values are relative to the height of the sheet and specified top down. I.e. 0.25 is 1/4 from the top of the sheet and 0.75 is 1/4 from the bottom.

The special value `'auto'` will auto-calculate snappoints where possible. E.g. If there is a lot of space at the bottom of the sheet, a snappoint will be set to allow the sheet to be minimized to fit content.

Snappoints are also auto-calculated when this value is set to `'auto'` and the sheet has dynamic sheet content. See [snippets](#snippets).

**`initialIndex` - optional**

An integer specifying the snappoint at which the sheet will open. For practical purposes, indexing starts at 1. E.g. given the array [0.25, 0.5. 0.75], 0.25 is at index 1, not 0!

If omitted, the sheet opens full height. Values outside the range will either open the sheet full height, or not open it.

**`canDragSheet` - optional**

A boolean specifying if the sheet can be dragged on the content. Defaults to true. The header is always draggable.

**`headerOverlaysContent` - optional**

Boolean. For scrollable sheets, if set to true, the content will scroll behind the header. I.e. the scrollable region takes up the full height of the dialog. A background blur is applied to the header. Defaults is false.

**`stickyHeader` - optional**

Boolean. If true the header will stick to the bottom of the page ~~and can only be closed programatically~~. Default is false.

**`openSticky` - optional**

Boolean. When true, and stickyHeader is true, the sheet will open with the header in the sticky position :wink:. Default is false.

**`toggleOnHeaderTap` - optional**

Boolean. Enables tap on header to minimize and maximize the sheet when stickyHeader is true. If stickyHeader is false, a header tap will close the sheet. The maximized state is either the full height, or, if set, the intial snapPoint. Default is false.

**`closeOnBackdropTap` - optional**

Boolean. Defaults to true.

**`flat` - optional**

Boolean. Don't scale the background. Defaults to false.

**`nonmodal` - optional**

Boolean or integer (snappoint index). For sheets that are not full height, allow the background to be interacted with while the sheet is open. If a snappoint index is specified, e.g. `nonmodal={1}` , the sheet will become nonmodal at that snappoint. Can be used to create a "detent" that sticks to the bottom of the screen. Defaults to false, i.e. modal.

**`onclose()` - optional**

A function to run when the sheet has completely closed, i.e. the close transition has completed.

**`onsnap()` - optional**

A function to run when the snappoint changes. Runs before the the transition to the new snappoint. Passes the snappoint as parameter, e.g. 0.25, not the index

## Snippets

**`children()` - required (unless you want a blank sheet)**

The main content for the bottom sheet

**`header()`- optional**

The header content

**`snapPoint1Content()` - optional**

If specified, the content of the sheet will change to this content when dragged to the first snappoint.

**`snapPoint2Content()`- optional**

If specified, the content of the sheet will change to this content when dragged to the second snappoint.

## Programmatic control

Use the `bind:this` directive to expose the instance methods:

- showModal()
- show()
- close()
- snapTo(index)

See [programmaticcontrol.svelte](https://github.com/devantic/diaper/tree/main/src/routes/examples/programmaticcontrol.svelte) for an example.

## Styling

The sheet can be styled using tailwind or css by passing a `class` prop or `style` prop (or both) on the component instance.

### Tailwind

You must use the important (!) modifier!

```svelte
<Bottomsheet bind:open class="p-4! pt-0! bg-red-500!">...</Bottomsheet>
```

### CSS

```svelte
<Bottomsheet bind:open style="padding: 1rem; padding-top: 0; background-color: red;">...</Bottomsheet>
```

### Other methods

Alternatively you can pass css classes to the component using these methods:

#### Scoped, the way svelte likes it!

You can pass css classes to style the sheet using the container method:

```svelte
<div class="container">
	<Bottomsheet bind:open class="sheet">...</Bottomsheet>
</div>

<style>
	.container :global(.sheet) {
		padding: 1rem;
		padding-top: 0;
		background-color: red;
	}
</style>
```

#### External stylesheet

Or you can import a stylesheet

```svelte
<script>
	import './sheet.css'
</script>

<div class="container">
	<Bottomsheet bind:open class="sheet">...</Bottomsheet>
</div>
```

`sheet.css`

```css
.sheet {
	padding: 1rem;
	padding-top: 0;
	background-color: red;
}
```
