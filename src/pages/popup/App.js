import React, {Component} from 'react'
import {HeaderSection, Section, Toggle, Link, Button} from 'src/pages/components/settings'
import psl from 'psl'
import 'src/pages/components/styles'
import styles from './index.scss'


class App extends Component {
	siteLabelPairs = {
		'siteKeyboardNav': 'Enable keyboard navigation',
		'siteStaticCaptions': 'Enable static captions',
		'siteTextboxExpansion': 'Enable textbox expansion',
		'siteCustomStyles': 'Enable custom styles',
		'siteAutoSaveProgress': 'Auto-save progress' }

	constructor(props) {
		super(props)
		this.state = {loading: true}

		this.handleChange = this.handleChange.bind(this)
		this.getStorageFromTabUrl = this.getStorageFromTabUrl.bind(this)
		this.bootstrapStateFromResponse = this.bootstrapStateFromResponse.bind(this)
		this.processStorageChange = this.processStorageChange.bind(this)
	}

	shouldComponentUpdate() {
		if (this.loading) {
			return false
		}
		return true
	}

	componentDidMount() {
		let query = { active: true, currentWindow: true }
		chrome.tabs.query(query, this.getStorageFromTabUrl)
	}

	getStorageFromTabUrl(tabs) {
		// set URL
		let url = new URL(tabs[0].url)
		let path = url.pathname + url.search

		// parse URL
		let parsedUrl = psl.parse(url.hostname)
		// if subdomain that isn't www, add it to the final domain
		let domain = (parsedUrl.subdomain === 'www' || parsedUrl.subdomain === null) ? '' : parsedUrl.subdomain + '.'
		domain += parsedUrl.domain

		this.setState({ url: url })
		this.setState({ path: path })
		this.setState({ domain: domain})

		// apply settings from background page
		chrome.runtime.sendMessage({
			domain: domain,
			path: path,
			popup: true
		}, this.bootstrapStateFromResponse)
		// add storage listener
		chrome.storage.onChanged.addListener(this.processStorageChange)
	}

	bootstrapStateFromResponse(response) {
		this.setState(response.config)
		// set loading to be false to start rendering
		this.setState({ loading: false })
	}

	processStorageChange(changes, namespace) {
		let processedChanges = {}
		for (let key in changes) {
			// only apply changes if applicable to this site
			if (key in this.state) {
				processedChanges[key] = changes[key].newValue
			}
		}
		this.setState(processedChanges)
	}

	handleChange(key, value) {
		let dict = { [key] : value }
		chrome.storage.sync.set(dict, function() {
			this.setState(dict)
		}.bind(this))
	}

	render() {
		if (this.state.loading) {
			return (
				<div className={styles.pageContainer}>
					<div className={styles.pageContent} />
				</div>
			)
		}

		return (
			<div>
				<HeaderSection title="Proclivity" type="popup">
					<Toggle key="globalEnabled"
							id="globalEnabled"
							value={this.state.globalEnabled}
							onChange={this.handleChange}
							title="Enabled" />
					<Link key="options"
			              url={chrome.extension.getURL('pages/options/index.html')}
			              title="More options" />
				</HeaderSection>
				<Section title="Settings for this site" type="popup">
					{Object.entries(this.state).map(([key, value]) => {
						let baseName = key.split('_')[0]
						if (baseName in this.siteLabelPairs) {
							return <Toggle key={key}
								id={key}
								value={value}
								onChange={this.handleChange}
								title={this.siteLabelPairs[baseName]} />
						}
					})}
					<Button key="save"
							id={'siteProgressManualSaved_' + this.state.domain}
							onChange={this.handleChange}
							title="Save checkpoint"
							action="Save" />
					<Link key="load"
						  url={this.state.['siteProgressManualSaved_' + this.state.domain]}
						  title="Load saved checkpoint" />
				</Section>
			</div>
		)
	}
}

export default App
