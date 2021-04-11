import {
  CaptionRule,
  ExpansionRule,
  SiteMeta,
  SiteRuleResponse,
  StyleRule,
  UserSettings,
  WebcomicRules,
} from '@src/types'
import { Navigation } from './components/navigation'
import { Styles } from './components/styles'

// website stuffs
class ComicWebsite {
  // strings
  nextCombo: string
  prevCombo: string
  autoSavedUrl: string
  sitePath: string

  // global config
  globalEnableKeyboardNav: boolean
  globalEnableCaptions: boolean
  globalEnableExpansions: boolean
  globalEnableStyles: boolean
  globalEnableAutoSaveProgress: boolean

  // site config
  localEnableKeyboardNav: boolean
  localEnableCaptions: boolean
  localEnableExpansions: boolean
  localEnableStyles: boolean
  localEnableAutoSaveProgress: boolean

  // rules
  webcomicRules: WebcomicRules

  // constructs
  styles: import('./components/styles').Styles
  navigation: import('./components/navigation').Navigation
  captions: import('./components/captions').Caption[] = []
  expansionSets: import('./components/expansions').ExpansionSet[] = []

  constructor(siteMeta: SiteMeta, config: UserSettings) {
    this.webcomicRules = siteMeta.data as WebcomicRules
    this.sitePath = siteMeta.path as string
    let coreUrl = siteMeta.coreUrl

    // set nav config
    this.nextCombo = config['globalNextCombo'].join(' ')
    this.prevCombo = config['globalPrevCombo'].join(' ')

    // set global config
    this.globalEnableKeyboardNav = config['globalKeyboardNav'] as boolean
    this.globalEnableCaptions = config['globalStaticCaptions'] as boolean
    this.globalEnableExpansions = config['globalTextboxExpansion'] as boolean
    this.globalEnableStyles = config['globalCustomStyles'] as boolean
    this.globalEnableAutoSaveProgress = config[
      'globalAutoSaveProgress'
    ] as boolean

    // set local config
    this.localEnableKeyboardNav = config[
      'siteKeyboardNav_' + coreUrl
    ] as boolean
    this.localEnableCaptions = config[
      'siteStaticCaptions_' + coreUrl
    ] as boolean
    this.localEnableExpansions = config[
      'siteTextboxExpansion_' + coreUrl
    ] as boolean
    this.localEnableStyles = config['siteCustomStyles_' + coreUrl] as boolean
    this.localEnableAutoSaveProgress = config[
      'siteAutoSaveProgress_' + coreUrl
    ] as boolean
    this.autoSavedUrl = config['siteProgressAutoSaved_' + coreUrl] as string

    // setup
    this.styles = new Styles(this.globalEnableStyles && this.localEnableStyles)
    this.navigation = new Navigation(
      this.webcomicRules.navigation,
      this.nextCombo,
      this.prevCombo,
    )

    this.initialize()
  }

  initialize(): void {
    // need to get nav up as soon as possible — this may fail sometimes due to DOM not being fully loaded, so it's repeated after the DOM has loaded
    // this method is idempotent, so it can be called multiple times without adverse affect
    this.loadUnfinished()

    // set up canary variables in case the page loads too fast to catch specific readyStates
    var postLoaded = false

    browser.runtime.onMessage.addListener(
      (
        request: string,
        sender: browser.runtime.MessageSender,
        sendResponse: any,
      ) => {
        // listen for messages sent from background.js
        if (request === 'urlchanged') {
          this.refreshComic()
        }
      },
    )

    document.addEventListener('readystatechange', (event: any) => {
      // when window loaded ( external resources are loaded too- `css`,`src`, etc...)
      if (event.target.readyState === 'complete' && !postLoaded) {
        // load things that are content-dependent (e.g. alt-text)
        this.loadFinished()
        postLoaded = true
      }
    })

    // if document already fully finished loading before listeners could be added, load everything
    // also allow for skipWait if sites have slow loading times but don't need full DOM to render (e.g. qwantz.com)
    if (document.readyState === 'complete' && !postLoaded) {
      // load any remainders that were missed above
      this.loadFinished()
      postLoaded = true
    }
  }

  // things that should occur before the page finishes loading
  loadUnfinished(): void {
    // apply nav if enabled globally and locally and if the nav selectors exist
    if (
      this.globalEnableKeyboardNav &&
      this.localEnableKeyboardNav &&
      this.webcomicRules.navigation
    ) {
      this.navigation.apply()
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

    // apply CSS rules to generated content if enabled globally and locally
    if (this.webcomicRules.styles) {
      this.addStyles()
    }
  }

  // things that should occur after the page finishes loading
  loadFinished(): void {
    // copy alt-text if enabled globally and locally and if the alt selectors exist
    if (
      this.globalEnableCaptions &&
      this.localEnableCaptions &&
      this.webcomicRules.captions
    ) {
      import('./components/captions').then(({ Caption }) => {
        import('@src/utils').then(({ querySelectorAllList }) => {
          this.processCaptions(querySelectorAllList, Caption)
        })
      })
    }

    // expand drop-down text and images if enabled globally and locally and if the expansion selectors exist
    if (
      this.globalEnableExpansions &&
      this.localEnableExpansions &&
      this.webcomicRules.expansions
    ) {
      import('./components/expansions').then(({ ExpansionSet }) => {
        this.processExpansions(ExpansionSet)
      })
    }
  }

  reset(): void {
    for (let caption of this.captions) {
      // remove the post-comic wrapper contents
      caption.postComicWrapper.clear()
    }
    // reset generated styles
    this.styles.reset()
  }

  // refresh comic in case this is a single-page app (e.g. DaisyOwl); will get interrupted on DOM reload for non-single-page sites
  refreshComic(): void {
    this.reset()
    // re-run the items that are generated after page load — include items before load finishes for single-page apps where nav elements might change
    this.loadUnfinished()
    this.loadFinished()

    // re-send message to update progress, since everything is already applied (i.e. single-page app), don't need to worry about the response
    browser.runtime.sendMessage({ popup: false }).then(({}) => {})
  }

  addStyles(): void {
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

  // copy alt-text to below the comic
  processCaptions(
    querySelectorAllList: typeof import('@src/utils').querySelectorAllList,
    Caption: typeof import('./components/captions').Caption,
  ): void {
    this.captions = []

    // copy alt-text
    for (let altRule of this.webcomicRules.captions as CaptionRule[]) {
      // get the comic image elements
      let comics: HTMLElement[] = querySelectorAllList(altRule.comicSelector)
      // add the elements to the list and process them
      for (let comic of comics as any) {
        let caption = new Caption(comic, altRule, this.styles)
        this.captions.push(caption)
        caption.process()
      }
    }
  }

  // expand drop-down text and images (e.g. XKCD's What-If and SMBC)
  processExpansions(
    ExpansionSet: typeof import('./components/expansions').ExpansionSet,
  ): void {
    this.expansionSets = []

    // for each expansion rule, generate rule and set objects then process
    for (let expansionRule of this.webcomicRules
      .expansions as ExpansionRule[]) {
      let expansionSet = new ExpansionSet(expansionRule, this.styles)
      this.expansionSets.push(expansionSet)
      expansionSet.process()
    }
  }
}

// process the global page's response
function handleResponse(response: SiteRuleResponse): void {
  // if globally disabled, bypass all logic and skip
  if (!response.config.globalEnabled) {
    return
  }

  // pass the rules to the comic class
  new ComicWebsite(response.siteMeta as SiteMeta, response.config)
}

// send a message to the background page to get rules from the domain
browser.runtime.sendMessage({ popup: false }).then(handleResponse)
