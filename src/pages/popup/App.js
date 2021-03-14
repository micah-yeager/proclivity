import React, {Component} from 'react'
import {HeaderSection, Section, Toggle, Link, Button} from 'src/pages/components/settings'
import psl from 'psl'
import 'src/pages/components/styles'
import styles from './index.scss'


class App extends Component {
	siteDefaultPairs = {
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
		this.bootstrapStateFromStorage = this.bootstrapStateFromStorage.bind(this)
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
		let url = tabs[0].url
		this.setState({ url: url })

		// parse URL
		let parsedUrl = psl.parse((new URL(url)).hostname)
		// if subdomain that isn't www, add it to the final domain
		let domain = (parsedUrl.subdomain === 'www' || parsedUrl.subdomain === null) ? '' : parsedUrl.subdomain + '.'
		domain += parsedUrl.domain
		this.setState({ domain: domain})

		// set up defaults
		let globalDefaults = {
			globalEnabled: true,
			nextCombo: ['right'],
	        prevCombo: ['left'],
	        globalKeyboardNav: true,
	        globalStaticCaptions: true,
	        globalTextboxExpansion: true,
	        globalCustomStyles: true,
	        globalAutoSaveProgress: true }
		let siteDefaultValue = true
		let siteDefaults = {
			['siteProgressManualSaved_' + domain]: url,
		}
		
		// add site-specific defaults
		for (const [key, value] of Object.entries(this.siteDefaultPairs)) {
			let newKey = key + '_' + domain
			delete Object.assign(this.siteDefaultPairs, {[newKey]: this.siteDefaultPairs[key] })[key]
			siteDefaults[key + '_' + domain] = siteDefaultValue
		}

		// combine defaults
		this.defaults = { ...globalDefaults, ...siteDefaults }
		// apply settings from storage
		chrome.storage.sync.get(this.defaults, this.bootstrapStateFromStorage)
		// add storage listener
		chrome.storage.onChanged.addListener(this.processStorageChange)
	}

	bootstrapStateFromStorage(items) {
		for (const [key, value] of Object.entries(items)) {
			this.setState({ [key]: value })
		}
		// set loading to be false to start rendering
		this.setState({ loading: false })
	}

	processStorageChange(changes, namespace) {
		let reloadAll = false
		let reloadSite = false

		for (let key in changes) {
			// only apply changes if applicable to this site
			if (key in this.defaults) {
				this.setState({ [key]: changes[key].newValue })

				if (key.startsWith('global')) {
					reloadAll = true
				} else if (key.startsWith('site')) {
					reloadSite = true
				}
			}
		}

		if (reloadAll) {
			chrome.runtime.sendMessage({
				reload: '__all__'
			}, function(ack) {})

		} else if (reloadSite) {
			chrome.runtime.sendMessage({
				reload: this.state.domain
			}, function(ack) {})
		}
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
					{Object.entries(this.siteDefaultPairs).map(([key, value]) => 
						<Toggle key={key}
								id={key}
								value={this.state[key]}
								onChange={this.handleChange}
								title={value} />
					)}
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
