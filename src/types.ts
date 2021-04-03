// site index
export interface IndexSite {
	name: string
	url: string
}

// webcomic types
export interface Navigation {
	nextSelector: string
	previousSelector: string
	levelsAboveSelector?: number
}
export interface Destination {
	selector: string
	insertionType: 'replace' | 'before' | 'after' | 'prependChild' | 'appendChild'
}
export interface Caption {
	comicSelector: string
	ignorePattern?: RegExp[]
	afterComicSelector?: string

	destination: Destination
	wrapperStyles?: string
	styles?: string
}
export interface Expansion {
	sourceSelector: string
	destination: Destination
	isLink?: boolean

	prefix?: string
	suffix?: string

	styles?: string
}
export interface Style {
	destinationSelector: string
	styles: string
}
export interface AutoSave {
	additionalIndices: string[]
	allowPattern: RegExp
	ignorePattern: RegExp
}
export interface WebComic {
	name: string
	indexUrl: string
	skipIndex?: boolean
	nsfw?: boolean

	navigation: Navigation
	caption: Caption
	expansions: Expansion[]
	styles: Style[]
	autoSave: AutoSave
}
export interface Host {
	[id: string]: WebComic
}
export interface Sites {
	[id: string]: Host
}
