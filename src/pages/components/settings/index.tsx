import React, { Component } from 'react'
import styles from './index.scss'

import { MdLaunch, MdFiberManualRecord } from 'react-icons/md'
// import icons from 'src/assets'
import Mousetrap from 'tn-mousetrap'
import 'tn-mousetrap/plugins/record/mousetrap-record'

class Toggle extends Component {
	props: { [key: string]: any }

	constructor(props: { [key: string]: any }) {
		super(props)

		// not strictly needed, but silences a compiler warning
		this.props = props

		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event: any): void {
		this.props.onChange(event.target.id, event.target.checked)
	}

	render(): JSX.Element {
		let toggleStyles = `${styles.setting} ${styles.toggleRow}`

		return (
			<div className={toggleStyles}>
				<label className={styles.toggleRowLabel}>
					<input
						type="checkbox"
						id={this.props.id}
						className={styles.toggleRowInput}
						checked={this.props.value}
						onChange={this.handleChange}
					/>
					<div className={styles.toggleRowWrapper}>
						<div className={styles.toggleRowTitle}>{this.props.title}</div>
						<div className={styles.settingDescription}>
							{this.props.description}
						</div>
					</div>
					<div className={styles.toggleRowToggle} role="button">
						<span className={styles.toggleRowToggleBar}></span>
						<span className={styles.toggleRowToggleKnob}></span>
					</div>
				</label>
			</div>
		)
	}
}

class KeyCombo extends Component {
	sequenceJoiner = ', then '

	props: { [key: string]: any }
	state: { [key: string]: any }
	refs: { [key: string]: any } = {}

	constructor(props: { [key: string]: any }) {
		super(props)

		// not strictly needed, but prevents a compiler warning
		this.props = props
		this.state = { textValue: this.props.value.join(this.sequenceJoiner) }

		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(event: any): void {
		let tooltip = this.refs.tooltip
		tooltip.style = 'visibility: visible; opacity: 1;'

		Mousetrap.record((sequence: string[]) => {
			tooltip.style = ''
			this.props.onChange(this.props.id, sequence)
			this.setState({ textValue: sequence.join(this.sequenceJoiner) })
		})
	}

	render(): JSX.Element {
		let keyComboStyles = `${styles.setting} ${styles.keyComboRow}`

		return (
			<div
				className={keyComboStyles}
				id={this.props.id}
				onClick={this.handleClick}
			>
				<div className={styles.keyComboRowWrapper}>
					<div className={styles.sectionTitle}>{this.props.title}</div>
					<div className={styles.settingDescription}>
						Click to record key combo. Recording will stop automatically several
						seconds after releasing the keys — this allows for key sequences
						(e.g. /, then right).
					</div>
				</div>
				<div className={styles.keyComboRowCombo}>
					{this.state.textValue}
					<span ref="tooltip" className={styles.tooltip}>
						<span className={styles.tooltipIcon}>
							<MdFiberManualRecord />
						</span>
						<span className={styles.tooltipText}>Recording</span>
					</span>
				</div>
			</div>
		)
	}
}

function Link(props: { [key: string]: any }): JSX.Element {
	let linkStyles = `${styles.setting} ${styles.linkRow}`

	return (
		<a className={linkStyles} href={props.url} target="_blank">
			<div className={styles.linkRowWrapper}>
				<div className={styles.settingTitle}>{props.title}</div>
				<div className={styles.settingDescription}>{props.description}</div>
			</div>
			<div className={styles.linkRowLink}>
				<MdLaunch />
			</div>
		</a>
	)
}
class Button extends Component {
	props: { [key: string]: any }

	constructor(props: { [key: string]: any }) {
		super(props)

		this.props = props

		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(event: any): void {
		let query = { active: true, currentWindow: true }
		browser.tabs.query(query).then((tabs) => {
			let url = tabs[0].url
			this.props.onChange(this.props.id, url)
			window.close()
		})
	}

	render(): JSX.Element {
		let buttonStyles = `${styles.setting} ${styles.buttonRow}`

		return (
			<div className={buttonStyles} id={this.props.id}>
				<div className={styles.buttonRowWrapper}>
					<div className={styles.settingTitle}>{this.props.title}</div>
					<div className={styles.settingDescription}>
						{this.props.description}
					</div>
				</div>
				<div className={styles.verticalSeperator} />
				<div className={styles.buttonRowButton} onClick={this.handleClick}>
					{this.props.action}
				</div>
			</div>
		)
	}
}
function Info(props: { [key: string]: any }): JSX.Element {
	return (
		<div className={styles.setting}>
			<div className={styles.settingTitle}>{props.title}</div>
			<div className={styles.settingDescription}>{props.description}</div>
		</div>
	)
}

function Header(props: { [key: string]: any }): JSX.Element {
	let icon
	let title
	if (props.type === 'popup') {
		icon = (
			<img
				className={styles.headerPopupIcon}
				alt="Extension Icon"
				src={'/assets/images/Proclivity-32.png'}
			/>
		)
		title = <span className={styles.headerPopupTitle}>{props.title}</span>
	} else {
		icon = (
			<img
				className={styles.headerIcon}
				alt="Extension Icon"
				src="/assets/images/Proclivity-256.png"
			/>
		)
		title = <h1 className="title">{props.title}</h1>
	}

	return (
		<div className={styles.headerWrapper}>
			{icon}
			{title}
		</div>
	)
}
function HeaderSection(props: { [key: string]: any }): JSX.Element {
	// props:
	// - type<string>: 'popup' or anything else
	// - title<string>: title of the extension

	return (
		<SectionInner additionalClasses={styles.settingsSectionHeader}>
			<Header key="header" title={props.title} type={props.type} />
			{props.children}
		</SectionInner>
	)
}

function SectionInner(props: { [key: string]: any }): JSX.Element {
	// props:
	// - additionalClasses<string>: classes to append
	// - content:

	let classes = `${styles.settingsSection} ${props.additionalClasses || ''}`

	return <div className={classes}>{props.children}</div>
}

function Section(props: { [key: string]: any }): JSX.Element {
	let sectionStyles = styles.settingsSectionHeader
	if (props.type === 'popup') {
		sectionStyles = `${sectionStyles} ${styles.settingsSectionHeaderPopup}`
	}

	return (
		<div className={styles.settingsWrapper}>
			<div className={sectionStyles}>
				<h2 className={styles.settingsWrapperTitle}>{props.title}</h2>
			</div>
			<div className={styles.settingsSection}>
				<SectionInner>{props.children}</SectionInner>
			</div>
		</div>
	)
}

export { Section, HeaderSection, Toggle, KeyCombo, Link, Info, Button }
