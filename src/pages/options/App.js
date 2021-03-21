import React, { Component } from 'react'
import {
	HeaderSection,
	Section,
	Toggle,
	KeyCombo,
	Link,
	Info,
} from 'src/pages/components/settings'
import 'src/pages/components/styles'
import styles from './index.scss'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = { loading: true }

		this.handleChange = this.handleChange.bind(this)
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
		let toggleOptionDefaults = {
			globalEnabled: true,
			automaticUpdates: true,
			enableNewSites: true,
			globalStaticCaptions: true,
			globalKeyboardNav: true,
			globalCustomStyles: true,
			globalTextboxExpansion: true,
		}
		let keyComboDefaults = {
			nextCombo: ['right'],
			prevCombo: ['left'],
		}
		this.defaults = { ...toggleOptionDefaults, ...keyComboDefaults }

		// apply settings from storage
		chrome.runtime.sendMessage(
			'siteList',
			function (siteList) {
				this.siteList = siteList
				chrome.storage.sync.get(this.defaults, this.bootstrapStateFromStorage)
			}.bind(this),
		)
		chrome.storage.onChanged.addListener(this.processStorageChange)
	}

	bootstrapStateFromStorage(items) {
		for (const [key, value] of Object.entries(items)) {
			this.setState({ [key]: value })
		}

		this.setState({ loading: false })
	}

	processStorageChange(changes, namespace) {
		let reload = false

		for (let key in changes) {
			this.setState({ [key]: changes[key].newValue })
		}
	}

	handleChange(key, value) {
		let dict = { [key]: value }
		chrome.storage.sync.set(
			dict,
			function () {
				this.setState(dict)
			}.bind(this),
		)
	}

	render() {
		if (this.state.loading) {
			return (
				<div className={styles.pageContainer}>
					<div className={styles.pageContent}>Loading...</div>
				</div>
			)
		}

		return (
			<div className={styles.pageContainer}>
				<div className={styles.pageContent}>
					<HeaderSection title="Proclivity">
						<Toggle
							key="globalEnabled"
							id="globalEnabled"
							value={this.state.globalEnabled}
							onChange={this.handleChange}
							title="Enabled"
						/>
					</HeaderSection>
					<Section title="Keyboard navigation">
						<Toggle
							key="globalKeyboardNav"
							id="globalKeyboardNav"
							value={this.state.globalKeyboardNav}
							onChange={this.handleChange}
							title="Enable keyboard navigation"
							description="Key combos are added to each webcomic page to allow for navigating via keyboard. To disable keyboard navigation, de-select this option."
						/>
						<KeyCombo
							key="nextCombo"
							id="nextCombo"
							value={this.state.nextCombo}
							onChange={this.handleChange}
							title="Key combo for next page"
						/>
						<KeyCombo
							key="prevCombo"
							id="prevCombo"
							value={this.state.prevCombo}
							onChange={this.handleChange}
							title="Key combo for previous page"
						/>
					</Section>
					<Section title="Settings for all sites">
						<Toggle
							key="globalStaticCaptions"
							id="globalStaticCaptions"
							value={this.state.globalStaticCaptions}
							onChange={this.handleChange}
							title="Enable static captions"
							description='Some webcomics have "alt-text" captions that only appear when the mouse is hovered over the comic. These are added to an always-visible caption below the originating image. To stop adding always-visible captions, de-select this option.'
						/>
						<Toggle
							key="globalTextboxExpansion"
							id="globalTextboxExpansion"
							value={this.state.globalTextboxExpansion}
							onChange={this.handleChange}
							title="Enable textbox expansion"
							description="Some webcomics have textboxes that must be manually expanded. These are automatically expanded in-place. To stop expanding textboxes, de-select this option."
						/>
						<Toggle
							key="globalCustomStyles"
							id="globalCustomStyles"
							value={this.state.globalCustomStyles}
							onChange={this.handleChange}
							title="Enable custom styles"
							description="Applies custom styles to certain elements to enhance readability. To stop applying custom styles, de-select this option."
						/>
						<Toggle
							key="globalAutoSaveProgress"
							id="globalAutoSaveProgress"
							value={this.state.globalCustomStyles}
							onChange={this.handleChange}
							title="Enable progress auto-saving"
							description="Auto-save progress while reading — this progress will be loaded when navigating to the webcomic main page. To stop auto-saving and auto-loading progress, de-select this option."
						/>
					</Section>
					<Section title="Support the dev">
						<Link
							key="paypal"
							id="paypal"
							url="https://paypal.me/MicahHummert"
							title="PayPal"
						/>
						<Link
							key="cash-app"
							id="cash-app"
							url="https://cash.app/$micahyeagers"
							title="Cash App"
						/>
						<Info
							key="bitcoin"
							id="bitcoin"
							title="Bitcoin wallet"
							description="39s1W2rJHbrVfN5hpTJUJt8T7EtBhuJr2e"
						/>
					</Section>
					<Section title="Supported webcomics">
						{Object.entries(this.siteList).map(([key, value]) => (
							<Link key={value} url={value} title={key} />
						))}
					</Section>
				</div>
			</div>
		)
	}
}

export default App
