// parse URL
export function parseBaseUrl(url: string): string {
	return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
}

export function querySelectorAllList(query: string): HTMLCanvasElement[] {
	let results: NodeListOf<HTMLCanvasElement> = document.querySelectorAll(query)
	return Array.prototype.slice.call(results)
}
