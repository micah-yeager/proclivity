import {
	SiteMeta,
	SiteRuleResponse,
	StyleRule,
	UserSettings,
	WebcomicRules,
} from '@src/types'
import { Styles } from './components/styles'

class BeforeFinished {
	// strings
	autoSavedUrl: string
	sitePath: string

	// global config
	globalEnableStyles: boolean
	globalEnableAutoSaveProgress: boolean

	// site config
	localEnableStyles: boolean
	localEnableAutoSaveProgress: boolean

	// rules
	webcomicRules: WebcomicRules

	// constructs
	styles: import('./components/styles').Styles

	constructor(siteMeta: SiteMeta, config: UserSettings) {
		this.webcomicRules = siteMeta.data as WebcomicRules
		this.sitePath = siteMeta.path as string
		let coreUrl = siteMeta.coreUrl

		// set global config
		this.globalEnableStyles = config['globalCustomStyles'] as boolean
		this.globalEnableAutoSaveProgress = config[
			'globalAutoSaveProgress'
		] as boolean

		// set local config
		this.localEnableStyles = config['siteCustomStyles_' + coreUrl] as boolean
		this.localEnableAutoSaveProgress = config[
			'siteAutoSaveProgress_' + coreUrl
		] as boolean
		this.autoSavedUrl = config['siteProgressAutoSaved_' + coreUrl] as string

		// setup
		this.styles = new Styles(this.globalEnableStyles && this.localEnableStyles)
		// apply CSS rules to generated content if enabled globally and locally
		if (this.webcomicRules.styles) {
			this.applyStyles()
		}

		let path = location.pathname + location.search
		if (
			this.globalEnableAutoSaveProgress &&
			this.localEnableAutoSaveProgress &&
			path !== this.autoSavedUrl &&
			// if matches sitePath or an additionalIndices item
			(path === this.sitePath ||
				// ensure exists before using .indexOf()
				(this.webcomicRules &&
					this.webcomicRules.autoSave &&
					this.webcomicRules.autoSave.additionalIndices &&
					this.webcomicRules.autoSave.additionalIndices.indexOf(path) > -1))
		) {
			import('node-snackbar').then((Snackbar) => {
				this.offerToLoadProgress(Snackbar)
			})
		}
	}

	applyStyles(): void {
		for (let styleRule of this.webcomicRules.styles as StyleRule[]) {
			this.styles.apply(styleRule)
		}
	}

	offerToLoadProgress(Snackbar: typeof import('node-snackbar')): void {
		Snackbar.show({
			text: 'Load saved progress?',
			pos: 'top-right',
			// set duration to 0 to have it open indefinitely
			duration: 0,
			alertScreenReader: true,
			// "first" button is on the right side
			showAction: true,
			actionText: 'No thanks',
			actionTextColor: '#f28b82',
			onActionClick: (element: HTMLElement) => {
				element.style.opacity = '0'
			},
			// "second" button is on the lift side
			showSecondButton: true,
			secondButtonText: 'Do it',
			secondButtonTextColor: '#1c82f0',
			onSecondButtonClick: (element: HTMLElement) => {
				// use .href() so history is generated
				location.href = this.autoSavedUrl as string
				// hide notification in case of single-page apps
				element.style.opacity = '0'
			},
			// force to any since types for Snackbar are incomplete
		} as any)
	}
}

// process the global page's response
function handleResponseBeforeFinished(response: SiteRuleResponse): void {
	// if globally disabled, bypass all logic and skip
	if (!response.config.globalEnabled) {
		return
	}

	// pass the rules to the comic class
	new BeforeFinished(response.siteMeta as SiteMeta, response.config)
}

// send a message to the background page to get rules from the domain
browser.runtime.sendMessage({ popup: false }).then(handleResponseBeforeFinished)
