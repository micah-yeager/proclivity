import Mousetrap from 'tn-mousetrap'
import DOMPurify from 'dompurify'
import Snackbar from 'node-snackbar'

import {
  StyleRule,
  ExpansionRule,
  WebcomicRules,
  CaptionRule,
  NavigationRule,
  SiteRuleResponse,
} from '@src/types'

// constants
let IMG_TYPES = ['jpg', 'png', 'gif']

// helpers
// parse URL
function parseBaseUrl(url: string): string {
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
}

function querySelectorAllList(query: string): HTMLCanvasElement[] {
  let results: NodeListOf<HTMLCanvasElement> = document.querySelectorAll(query)
  return Array.prototype.slice.call(results)
}

// styling classes
class Styles {
  rules: StyleRule[] = []
  private _node: HTMLElement

  constructor() {
    // create rule to hide the .wip
    this.rules.push({
      selector: '.proclivity-wip',
      properties: 'display: none !important;',
    })

    this._node = this.get_or_create_node()
  }

  addRule(style: StyleRule): void {
    this.rules.push(style)
  }

  get_or_create_node(): HTMLElement {
    // if exists but not defined
    if (document.querySelector('#proclivity-style')) {
      let node = document.querySelector('#proclivity-style')
      return node as HTMLElement
    }

    // otherwise, create the node
    // Following code adapted from Matt Mitchell, http://stackoverflow.com/a/3286307
    // create a style header in the document
    let head = document.getElementsByTagName('HEAD')[0]
    let node = head.appendChild(window.document.createElement('style'))
    node.setAttribute('id', 'proclivity-style')
    node.setAttribute('type', 'text/css')
    node.setAttribute('rel', 'stylesheet')

    return node
  }

  get node(): HTMLElement {
    // if already defined
    if (!this._node) {
      this._node = this.get_or_create_node()
    }
    return this._node
  }

  apply(): void {
    // build CSS using contenated selectors, brackets, and styles
    for (let rule of this.rules) {
      let selector = rule.selector
      let properties = rule.properties

      // create the CSS rule with properties
      let content: Text = document.createTextNode(
        selector + ' {' + properties + '}',
      )
      this.node.appendChild(content)
    }
  }

  reset(): void {
    this.node.innerHTML = ''
  }
}

class Navigation {
  nextCombo: string
  prevCombo: string
  rule: NavigationRule

  levelsRange: number[] = []
  nextBound: boolean = false
  prevBound: boolean = false

  constructor(rule: NavigationRule, nextCombo: string, prevCombo: string) {
    this.rule = rule
    this.nextCombo = nextCombo
    this.prevCombo = prevCombo
  }

  initialize(): void {
    // get next and previous button elements
    let prev: HTMLElement | null = document.querySelector(
      this.rule.previousSelector,
    )
    let next: HTMLElement | null = document.querySelector(
      this.rule.nextSelector,
    )

    // if defined, get the parents from selector (since queries can't select parent nodes)
    // need to use if {} because range generation will still generate a single-element array if undefined
    // this is the equivalent of Python's range()
    if (!this.levelsRange && this.rule.levelsAboveSelector) {
      this.levelsRange = [...Array(this.rule.levelsAboveSelector).keys()]
    }

    // bind the key combos
    if (prev && !this.prevBound) {
      // add for idempotency
      this.prevBound = true

      // get parents as defined above
      for (let {} of this.levelsRange) {
        prev = (prev as HTMLCanvasElement).parentElement
      }

      Mousetrap.bind(this.prevCombo, (event: any) => {
        // if the prev element exists, click it
        ;(prev as HTMLCanvasElement).click()
      })
    }

    if (next && !this.nextBound) {
      // add for idempotency
      this.nextBound = true

      // get parents as defined above
      for (let {} of this.levelsRange) {
        next = (next as HTMLCanvasElement).parentElement
      }

      Mousetrap.bind(this.nextCombo, (event: any) => {
        // if the next element exists, click it
        ;(next as HTMLCanvasElement).click()
      })
    }
  }

  reset(): void {
    Mousetrap.unbind(this.nextCombo)
    Mousetrap.unbind(this.prevCombo)
  }
}

// caption rules
class PostComicWrapper {
  comicNode: HTMLCanvasElement
  rule: CaptionRule
  style: Styles

  private _node: HTMLElement | undefined

  constructor(comicNode: HTMLCanvasElement, rule: CaptionRule, style: Styles) {
    this.comicNode = comicNode
    this.rule = rule
    this.style = style
  }

  // create an wrapper element in which to put the copied content
  get node(): HTMLElement {
    // if the node is known, return it
    if (this._node) {
      return this._node
    }

    this._node = document.createElement('div')
    this._node.setAttribute('class', 'proclivity-wrapper')

    let targetNode
    if (this.rule.destination && this.rule.destination.selector) {
      targetNode = document.querySelector(this.rule.destination.selector)

      if (targetNode) {
        // sibling nodes
        if (this.rule.destination.insertionMethod === 'before') {
          ;(targetNode.parentNode as HTMLElement).insertBefore(
            this._node,
            targetNode,
          )
        } else if (this.rule.destination.insertionMethod === 'after') {
          ;(targetNode.parentNode as HTMLElement).insertBefore(
            this._node,
            targetNode.nextSibling,
          )

          // parent nodes
        } else if (this.rule.destination.insertionMethod === 'prependChild') {
          targetNode.prepend(this._node)
        } else if (this.rule.destination.insertionMethod === 'appendChild') {
          targetNode.appendChild(this._node)

          // failsafe if no match
        } else {
          targetNode = undefined
        }
      }
    }

    if (!targetNode) {
      // place the created element after the comic
      ;(this.comicNode.parentNode as HTMLElement).insertBefore(
        this._node,
        this.comicNode.nextSibling,
      )
    }

    // add a class to the created element to temporarily hide it until processing is done
    this._node.classList.add('proclivity-wip')

    return this._node
  }

  set altText(data: any) {
    // create a text element
    let altNode = document.createElement('p')
    altNode.setAttribute('class', 'proclivity-alt-text')
    // create the alt-text to be added
    let altTextNode = document.createTextNode(data)
    // add the alt-text to the text element
    altNode.appendChild(altTextNode)
    // add the text element to the wrapper
    this.node.appendChild(altNode)

    // if the ruleset includes styling rules
    if (this.rule.styleProperties) {
      // build CSS rules to be added later
      this.style.addRule({
        selector: '.proclivity-wrapper > p',
        properties: this.rule.styleProperties,
      })
    }
  }

  set afterComic(node: any) {
    if (!document.querySelector('#proclivity-after-comic')) {
      node.setAttribute('id', 'proclivity-after-comic')

      // create a wrapper since we don't want it inline with the static caption
      let afterComicWrapper = document.createElement('div')
      afterComicWrapper.appendChild(node)

      // place the post-comic content within the wrapper
      this.node.insertAdjacentHTML('beforeend', afterComicWrapper.outerHTML)
    }
  }

  apply(): void {
    // add class to wrapper for styling
    this.node.classList.add('proclivity-wrapper')
    // set the wrapper width to the comic width
    if (this.rule.wrapperStyleProperties) {
      this.style.addRule({
        selector: '.proclivity-wrapper',
        properties: this.rule.wrapperStyleProperties,
      })
    }
    this.style.addRule({
      selector: '.proclivity-wrapper',
      properties: 'width:' + this.comicNode.width + 'px; margin: 0 auto',
    })
    // remove the temporary class to reveal it on the page
    this.node.classList.remove('proclivity-wip')
  }

  clear(): void {
    this.node.innerHTML = ''
  }
}
class Caption {
  node: HTMLCanvasElement
  rule: CaptionRule
  style: Styles

  postComicWrapper: PostComicWrapper
  afterComicNode: HTMLCanvasElement | null

  private _altText: string = ''

  constructor(node: HTMLCanvasElement, rule: CaptionRule, style: Styles) {
    this.node = node
    this.rule = rule
    this.style = style

    this.postComicWrapper = new PostComicWrapper(node, rule, style)
    this.afterComicNode = document.querySelector(
      rule.afterComicSelector as string,
    )
  }

  get altText(): string {
    // if alt-text is already defined, return it
    if (this._altText) {
      return this._altText

      // otherwise, find it
    } else {
      let data = DOMPurify.sanitize(this.node.getAttribute('title') as string)
      // if title text doesn't match the ignored regex
      if (data && !this._inIgnoreList(data)) {
        this._altText = data
      }
      return this._altText
    }
  }

  _inIgnoreList(data: any): boolean {
    // check if alt-text matches any ignored patterns (as listed in the ruleset)
    if (this.rule.ignoredPatterns) {
      for (let rawIgnoredPattern of this.rule.ignoredPatterns) {
        // use RegEx to test for the patterns
        let ignoredPattern = new RegExp(rawIgnoredPattern, 'g')
        // if a match is found, return true
        if (data.search(ignoredPattern) !== -1) {
          return true
        }
      }
    }
    return false
  }

  process(): void {
    // add the alt-text to the post-comic wrapper
    if (this.altText) {
      this.postComicWrapper.altText = this.altText
    }
    // add the after-comic to the post-comic wrapper
    if (this.afterComicNode) {
      this.postComicWrapper.afterComic = this.afterComicNode
    }

    this.postComicWrapper.apply()
  }
}

// element expansions
class Expansion {
  sourceNode: HTMLCanvasElement
  destinationNode: HTMLCanvasElement
  rule: ExpansionRule

  constructor(
    sourceNode: HTMLCanvasElement,
    destinationNode: HTMLCanvasElement,
    rule: ExpansionRule,
  ) {
    this.sourceNode = sourceNode
    this.destinationNode = destinationNode
    this.rule = rule
  }

  process(): void {
    // if the target is a link...
    if (this.rule.isLink && this.sourceNode.tagName == 'A') {
      // get link
      let link = new URL(this.sourceNode.getAttribute('href') as string)
      // get file extension from link
      let ext = (link.pathname
        .split('.')
        .slice(-1)
        .pop() as string).toLowerCase()
      // check if it's in the approved image extensions
      if (ext in IMG_TYPES) {
        // build the destination node contents as an node utilizing the link (usually as an img source)
        this.destinationNode.innerHTML = [
          // contentPrefix usually contains something like <img src="
          this.rule.prefix,
          DOMPurify.sanitize(link.href),
          // contentSuffix usually contains something like " />
          this.rule.suffix,
        ].join('')
        // otherwise, if it's a YouTube link
      } else if (parseBaseUrl(link.host) === 'youtube.com') {
        // TODO: implement YouTube imbeds
      }
      // otherwise (usually if it's just plain text)
    } else {
      // create the node with the set prefixes and suffixes
      this.destinationNode.innerHTML = [
        this.rule.prefix,
        // can't sanitize using encoding since subelements are allowed and often expected
        DOMPurify.sanitize(this.sourceNode.innerHTML),
        this.rule.suffix,
      ].join('')
    }
  }

  apply(): void {
    this.process()

    // remove the expansion source if it still exists and hasn't already been directly replaced by the expansion rule
    if (
      document.body.contains(this.sourceNode) &&
      this.rule.sourceSelector !== this.rule.destination.selector
    ) {
      ;(this.sourceNode.parentNode as HTMLCanvasElement).removeChild(
        this.sourceNode,
      )
    }
  }
}
class ExpansionSet {
  rule: ExpansionRule
  style: Styles

  id: string
  sourceNodes: HTMLCanvasElement[]
  destinationNodes: HTMLCanvasElement[]

  sources: Expansion[] = []

  constructor(rule: any, style: any) {
    this.rule = rule
    this.style = style

    this.id = '_' + Math.random().toString(36).substr(2, 9)
    this.sourceNodes = querySelectorAllList(rule.sourceSelector)
    this.destinationNodes = querySelectorAllList(rule.destination.selector)
  }

  process(): void {
    this.sources = []
    if (
      this.sourceNodes &&
      this.destinationNodes &&
      this.sourceNodes.length === this.destinationNodes.length
    ) {
      let iteration = 0
      for (let sourceNode of this.sourceNodes) {
        let destinationNode = this.destinationNodes[iteration]
        destinationNode.classList.add('proclivity-expansion' + this.id)

        let source = new Expansion(sourceNode, destinationNode, this.rule)
        this.sources.push(source)
        source.apply()

        iteration += 1
      }
      if (this.rule.styleProperties) {
        this.style.addRule({
          selector: '.proclivity-expansion' + this.id,
          properties: this.rule.styleProperties,
        })
      }
    }
  }
}

// website stuffs
class ComicWebsite {
  nextCombo: string
  prevCombo: string

  // global config
  enableNavGlobal: boolean
  enableAltGlobal: boolean
  enableAfterGlobal: boolean
  enableExpansionGlobal: boolean
  enableStylesGlobal: boolean

  // site config
  enableNavLocal: boolean
  enableAltLocal: boolean
  enableAfterLocal: boolean
  enableExpansionLocal: boolean
  enableStylesLocal: boolean

  // rules
  navSelectors: NavigationRule
  altRules: CaptionRule[]
  expansionRules: ExpansionRule[]
  styleRules: StyleRule[]

  // constructs
  style: Styles
  nav: Navigation
  captions: Caption[] = []
  expansionSets: ExpansionSet[] = []

  constructor(siteData: WebcomicRules, config: any, webcomicSite: any) {
    this.navSelectors = siteData.navigation
    this.altRules = siteData.captions
    this.expansionRules = siteData.expansions
    this.styleRules = siteData.styles

    // set nav config
    this.nextCombo = config['globalNextCombo'].join(' ')
    this.prevCombo = config['globalPrevCombo'].join(' ')

    // set global config
    this.enableNavGlobal = config['globalKeyboardNav']
    this.enableAltGlobal = config['globalStaticCaptions']
    this.enableAfterGlobal = config['globalStaticAfterComics']
    this.enableExpansionGlobal = config['globalTextboxExpansion']
    this.enableStylesGlobal = config['globalCustomStyles']

    // set local config
    this.enableNavLocal = config['siteKeyboardNav_' + webcomicSite]
    this.enableAltLocal = config['siteStaticCaptions_' + webcomicSite]
    this.enableAfterLocal = config['siteStaticAfterComics_' + webcomicSite]
    this.enableExpansionLocal = config['siteTextboxExpansion_' + webcomicSite]
    this.enableStylesLocal = config['siteCustomStyles_' + webcomicSite]

    // setup
    this.style = new Styles()
    this.nav = new Navigation(this.navSelectors, this.nextCombo, this.prevCombo)

    this.initialize()
  }

  initialize(): void {
    // need to get nav up as soon as possible — this may fail sometimes due to DOM not being fully loaded, so it's repeated after the DOM has loaded
    // this method is idempotent, so it can be called multiple times without adverse affect
    this.loadUnfinished()

    // set up canary variables in case the page loads too fast to catch specific readyStates
    var preLoaded = false
    var postLoaded = false

    browser.runtime.onMessage.addListener(
      function (request: string, sender: any, sendResponse: any): void {
        // listen for messages sent from background.js
        if (request === 'urlchanged') {
          this.refreshComic()
        }
      }.bind(this),
    )

    this.loadUnfinished()
    preLoaded = true

    document.addEventListener('readystatechange', (event: any) => {
      // when window loaded ( external resources are loaded too- `css`,`src`, etc...)
      if (event.target.readyState === 'complete' && !postLoaded) {
        // load any remainders that were missed above
        if (!preLoaded) {
          this.loadUnfinished()
          preLoaded = true
        }

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
    if (this.enableNavGlobal && this.enableNavLocal && this.navSelectors) {
      this.nav.initialize()
    }

    // apply CSS rules to generated content if enabled globally and locally
    if (this.enableStylesGlobal && this.enableStylesLocal) {
      if (this.styleRules) {
        this.addStyles()
      }
      this.style.apply()
    }
  }

  // things that should occur after the page finishes loading
  loadFinished(): void {
    // copy alt-text if enabled globally and locally and if the alt selectors exist
    if (this.enableAltGlobal && this.enableAltLocal && this.altRules) {
      this.processCaptions()
    }

    // expand drop-down text and images if enabled globally and locally and if the expansion selectors exist
    if (
      this.enableExpansionGlobal &&
      this.enableExpansionLocal &&
      this.expansionRules
    ) {
      this.processExpansions()
    }

    // apply CSS rules to generated content if enabled globally and locally
    if (this.enableStylesGlobal && this.enableStylesLocal) {
      this.style.apply()
    }
  }

  reset(): void {
    for (let caption of this.captions) {
      // remove the post-comic wrapper contents
      caption.postComicWrapper.clear()
    }
    // reset generated styles
    this.style.reset()
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
    for (let styleRule of this.styleRules) {
      this.style.addRule(styleRule)
    }
  }

  // copy alt-text to below the comic
  processCaptions(): void {
    this.captions = []
    // copy alt-text
    for (let altRule of this.altRules) {
      // get the comic image elements
      let comics: HTMLCanvasElement[] = querySelectorAllList(
        altRule.comicSelector,
      )
      // add the elements to the list and process them
      for (let comic of comics as any) {
        let caption = new Caption(comic, altRule, this.style)
        this.captions.push(caption)
        caption.process()
      }
    }
  }

  // expand drop-down text and images (e.g. XKCD's What-If and SMBC)
  processExpansions(): void {
    this.expansionSets = []
    // for each expansion rule, generate rule and set objects then process
    for (let expansionRule of this.expansionRules) {
      let expansionSet = new ExpansionSet(expansionRule, this.style)
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

  offerToLoadProgress(response)

  // pass the rules to the comic class
  new ComicWebsite(
    response.siteData as WebcomicRules,
    response.config,
    response.webcomicSite,
  )
}

function offerToLoadProgress(response: SiteRuleResponse): void {
  // do progress redirect here if enabled for the fastest turnaround time
  let path = location.pathname + location.search
  if (
    !response.config.globalAutoSaveProgress ||
    !response.config['siteAutoSaveProgress_' + response.webcomicSite] ||
    !(path !== response.autoSavedUrl) ||
    // if matches sitePath or an additionalIndices item
    !(
      path === response.sitePath ||
      // ensure exists before using .indexOf()
      (response.siteData &&
        response.siteData.autoSave &&
        response.siteData.autoSave.additionalIndices &&
        response.siteData.autoSave.additionalIndices.indexOf(path) > -1)
    )
  ) {
    return
  }

  //
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
    onActionClick: (element: HTMLCanvasElement) => {
      element.style.opacity = '0'
    },
    // "second" button is on the lift side
    showSecondButton: true,
    secondButtonText: 'Do it',
    secondButtonTextColor: '#1c82f0',
    onSecondButtonClick: (element: HTMLCanvasElement) => {
      // use .href() so history is generated
      location.href = response.autoSavedUrl as string
      // hide notification in case of single-page apps
      element.style.opacity = '0'
    },
    // force to any since types for Snackbar are incomplete
  } as any)
}

// send a message to the background page to get rules from the domain
browser.runtime.sendMessage({ popup: false }).then(handleResponse)
