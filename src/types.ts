// site index
export interface IndexSite {
	readonly name: string
	readonly url: string
}

// requests and responses
export interface SiteRuleRequest {
	popup: boolean

	// properties only used if a popup
	url?: string
	domain?: string
	path?: string
}
export interface UserSettings {
	readonly [key: string]: any
}
export interface SiteMeta {
	readonly coreUrl: string
	readonly exists: boolean

	readonly path: string | null
	readonly data: WebcomicRules | null
}
export interface SiteRuleResponse {
	readonly config: UserSettings
	readonly siteMeta?: SiteMeta
}

// webcomic rules
export interface NavigationRule {
	readonly nextSelector: string
	readonly previousSelector: string
	readonly levelsAboveSelector?: number
}
export type InsertionMethod =
	| 'replace'
	| 'before'
	| 'after'
	| 'prependChild'
	| 'appendChild'
	| 'replaceContents'
export interface DestinationRule {
	readonly selector: string
	readonly insertionMethod: InsertionMethod
}
export interface CaptionRule {
	readonly comicSelector: string
	// string array here since must be JSON serializable for content script
	readonly ignoredPatterns?: string[]
	readonly afterComicSelector?: string

	readonly destination?: DestinationRule
	readonly wrapperStyleProperties?: string
	readonly styleProperties?: string
}
export interface ExpansionRule {
	readonly sourceSelector: string
	readonly destination: DestinationRule
	readonly isLink?: boolean

	readonly prefix?: string
	readonly suffix?: string

	readonly styleProperties?: string
}
export interface StyleRule {
	readonly selector: string
	readonly properties: string
}
export interface AutoSaveRule {
	readonly additionalIndices?: string[]
	readonly allowedPattern: RegExp
	readonly ignoredPattern?: RegExp
}
export interface WebcomicRules {
	readonly name: string
	readonly indexUrl: string
	readonly skipIndex?: boolean
	readonly nsfw?: boolean

	readonly navigation: NavigationRule
	readonly captions?: CaptionRule[]
	readonly expansions?: ExpansionRule[]
	readonly styles?: StyleRule[]
	readonly autoSave?: AutoSaveRule
}
export interface Webcomics {
	readonly [key: string]: WebcomicRules
}
export interface WebcomicHosts {
	readonly [key: string]: Webcomics
}
