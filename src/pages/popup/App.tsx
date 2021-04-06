import React, { Component } from 'react'
import {
	HeaderSection,
	Section,
	Toggle,
	Link,
	Button,
	Info,
} from '@src/pages/components/settings'
import '@src/pages/components/styles'
import { SiteRuleResponse, WebcomicRules, SiteMeta } from '@src/types'

class App extends Component {
	state: { [key: string]: any }

	siteLabelPairs: { [key: string]: string } = {
		siteKeyboardNav: 'Enable keyboard navigation',
		siteStaticCaptions: 'Enable static captions',
		siteTextboxExpansion: 'Enable textbox expansion',
		siteCustomStyles: 'Enable custom styles',
		siteAutoSaveProgress: 'Auto-save progress',
	}

	constructor(props: { [key: string]: any }) {
		super(props)
		this.state = { loading: true }

		this.handleChange = this.handleChange.bind(this)
		this.getStorageFromTabUrl = this.getStorageFromTabUrl.bind(this)
		this.bootstrapStateFromResponse = this.bootstrapStateFromResponse.bind(this)
		this.processStorageChange = this.processStorageChange.bind(this)
	}

	shouldComponentUpdate(): boolean {
		if (this.state.loading) {
			return false
		}
		return true
	}

	componentDidMount(): void {
		let query = { active: true, currentWindow: true }
		browser.tabs.query(query).then(this.getStorageFromTabUrl)
	}

	getStorageFromTabUrl(tabs: browser.tabs.Tab[]): void {
		// set URL
		let url = new URL(tabs[0].url as string)
		let path = url.pathname + url.search

		// parse URL
		let domain = this.parseBaseUrl(url.hostname)

		this.setState({ url: url })
		this.setState({ path: path })
		this.setState({ domain: domain })

		// apply settings from background page
		browser.runtime
			.sendMessage({ popup: true, domain: domain, path: path })
			.then(this.bootstrapStateFromResponse)
		// add storage listener
		browser.storage.onChanged.addListener(this.processStorageChange)
	}

	parseBaseUrl(url: string): string {
		return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
	}

	bootstrapStateFromResponse(response: SiteRuleResponse): void {
		this.setState(response.config)
		this.setState({
			webcomicSite: (response.siteMeta as SiteMeta).data as WebcomicRules,
		})
		// set loading to be false to start rendering
		this.setState({ loading: false })
	}

	processStorageChange(
		changes: { [key: string]: browser.storage.StorageChange },
		namespace: string,
	): void {
		let processedChanges: { [key: string]: any } = {}
		for (let key in changes) {
			// only apply changes if applicable to this site
			if (key in this.state) {
				processedChanges[key] = changes[key].newValue
			}
		}
		this.setState(processedChanges)
	}

	handleChange(key: string, value: any): void {
		let dict = { [key]: value }
		browser.storage.sync.set(dict).then(
			function () {
				this.setState(dict)
			}.bind(this),
		)
	}

	render(): JSX.Element {
		if (this.state.loading) {
			return <div></div>
		}

		if (!this.state.webcomicSite) {
			return (
				<HeaderSection title="Proclivity" type="popup">
					<Toggle
						key="globalEnabled"
						id="globalEnabled"
						value={this.state.globalEnabled}
						onChange={this.handleChange}
						title="Enabled"
					/>
					<Link
						key="options"
						url={browser.extension.getURL('pages/options/index.html')}
						title="More options"
					/>
					<Info
						key="notEnabled"
						title="No settings for this page"
						description="Navigate to a comic on this site to see more settings"
					/>
				</HeaderSection>
			)
		}

		return (
			<div>
				<HeaderSection title="Proclivity" type="popup">
					<Toggle
						key="globalEnabled"
						id="globalEnabled"
						value={this.state.globalEnabled}
						onChange={this.handleChange}
						title="Enabled"
					/>
					<Link
						key="options"
						url={browser.extension.getURL('pages/options/index.html')}
						title="More options"
					/>
				</HeaderSection>
				<Section title="Settings for this site" type="popup">
					{Object.entries(this.state).map(([key, value]) => {
						let baseName = key.split('_')[0]
						if (baseName in this.siteLabelPairs) {
							return (
								<Toggle
									key={key}
									id={key}
									value={value}
									onChange={this.handleChange}
									title={this.siteLabelPairs[baseName]}
								/>
							)
						}
						return
					})}
					<Button
						key="save"
						id={'siteProgressManualSaved_' + this.state.webcomicSite}
						onChange={this.handleChange}
						title="Save checkpoint"
						action="Save"
					/>
					<Link
						key="load"
						url={
							this.state['siteProgressManualSaved_' + this.state.webcomicSite]
						}
						title="Load saved checkpoint"
					/>
				</Section>
			</div>
		)
	}
}

export default App
