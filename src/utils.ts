import { InsertionMethod } from '@src/types'

// parse URL
export function parseBaseUrl(url: string): string {
	return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
}

export function querySelectorAllList(query: string): HTMLElement[] {
	let results: NodeListOf<HTMLElement> = document.querySelectorAll(query)
	return Array.prototype.slice.call(results)
}

export function elementFromString(input: string): Node {
	// template tag has no element inheritance restrictions
	let template = document.createElement('template')

	// never return a space text node as a result
	input = input.trim()
	template.innerHTML = input

	return template.content
}

export function insertElement(
	node: Node,
	targetNode: HTMLElement,
	insertionMethod: InsertionMethod,
): void {
	// sibling nodes
	if (insertionMethod === 'before') {
		;(targetNode.parentNode as HTMLElement).insertBefore(node, targetNode)
	} else if (insertionMethod === 'after') {
		;(targetNode.parentNode as HTMLElement).insertBefore(
			node,
			targetNode.nextSibling,
		)

		// parent nodes
	} else if (insertionMethod === 'prependChild') {
		targetNode.prepend(node)
	} else if (insertionMethod === 'appendChild') {
		targetNode.appendChild(node)

		// replace node
	} else if (insertionMethod === 'replace') {
		;(targetNode.parentNode as HTMLElement).replaceChild(node, targetNode)
	} else if (insertionMethod === 'replaceContents') {
		// use any instead of HTMLElement since types hasn't been updated with .replaceChild() method yet
		;(targetNode as any).replaceChildren(node)

		// failsafe if no match
	}
}
