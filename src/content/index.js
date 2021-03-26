import Mousetrap from 'tn-mousetrap'
import DOMPurify from 'dompurify'

// constants
let IMG_TYPES = ['jpg', 'png', 'gif']

// helpers
// parse URL
function parseBaseUrl(url) {
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
}

function sanitizeHTML(str) {
  return str.replace(/[^\w. ]/gi, function (c) {
    return '&#' + c.charCodeAt(0) + ';'
  })
}

class KeyMapElement {
  constructor(varLabel, defaultValue) {
    this.varLabel = varLabel
    this.defaultValue = defaultValue
  }
}
class KeyMap {
  constructor(config, configKeyMap) {
    // check to make sure tag is in approved config tags
    for (let [tag, property] of Object.entries(configKeyMap)) {
      // use tag map to set local properties
      if (tag in config) {
        if (config[tag]) {
          this[property.varLabel] = config[tag]
        } else {
          this[property.varLabel] = property.defaultValue
        }
      }
    }
  }
}

// styling classes
class StyleRule {
  constructor(selector, styles) {
    this.selector = selector
    this.styles = styles
  }
}
class Style {
  constructor() {
    this.rules = []
    // create rule to hide the .wip
    this.rules.push(
      new StyleRule('.proclivity-wip', 'display: none !important;'),
    )
  }

  addRule(selector, styles) {
    this.rules.push(new StyleRule(selector, styles))
  }

  get node() {
    // if already defined
    if (this._node) {
      return this._node

      // if exists but not defined
    } else if (document.querySelector('#proclivity-style')) {
      this._node = document.querySelector('#proclivity-style')
      return this._node

      // otherwise, create the node
    } else {
      // Following code adapted from Matt Mitchell, http://stackoverflow.com/a/3286307
      // create a style header in the document
      let head = document.getElementsByTagName('HEAD')[0]
      this._node = head.appendChild(window.document.createElement('style'))
      this._node.setAttribute('id', 'proclivity-style')
      this._node.setAttribute('type', 'text/css')
      this._node.setAttribute('rel', 'stylesheet')

      return this._node
    }
  }

  apply() {
    // build CSS using contenated selectors, brackets, and styles
    for (let i = this.rules.length - 1; i >= 0; i--) {
      let selector = this.rules[i].selector
      let styles = this.rules[i].styles

      // create the CSS rule with styles
      let content = document.createTextNode(selector + ' {' + styles + '}')
      this.node.appendChild(content)
    }
  }

  reset() {
    this.node.innerHTML = ''
  }
}

class NavigationRule extends KeyMap {
  constructor(config) {
    let configKeyMap = {
      next: new KeyMapElement('next'),
      prev: new KeyMapElement('prev'),
      useParentLevel: new KeyMapElement('parentLevel'),
    }

    super(config, configKeyMap)
  }
}
class Navigation {
  constructor(rule, nextCombo, prevCombo) {
    this.rule = rule
    this.nextCombo = nextCombo
    this.prevCombo = prevCombo
  }

  initialize() {
    // get next and previous button elements
    let prev = document.querySelector(this.rule.prev)
    let next = document.querySelector(this.rule.next)

    // if defined, get the parents from selector (since queries can't select parent nodes)
    // need to use if {} because range generation will still generate a single-element array if undefined
    if (!this.levels && this.rule.parentLevel) {
      this.levels = [...Array(this.rule.parentLevel).keys()]
    }

    // bind the key combos
    if (prev && !this.prevBound) {
      // add for idempotency
      this.prevBound = true

      // get parents as defined above
      for (let i in this.levels) {
        prev = prev.parentElement
      }

      Mousetrap.bind(
        this.prevCombo,
        function (e) {
          // if the prev element exists, click it
          prev.click()
        }.bind(this),
      )
    }

    if (next && !this.nextBound) {
      // add for idempotency
      this.nextBound = true

      // get parents as defined above
      for (let i in this.levels) {
        next = next.parentElement
      }

      Mousetrap.bind(
        this.nextCombo,
        function (e) {
          // if the next element exists, click it
          next.click()
        }.bind(this),
      )
    }
  }

  reset() {
    Mousetrap.unbind(this.nextCombo)
    Mousetrap.unbind(this.nextCombo)
  }
}

// comic classes, used for alt-text and post-comic panels
class ComicRule extends KeyMap {
  constructor(config) {
    let configKeyMap = {
      comic: new KeyMapElement('comic'),
      destin: new KeyMapElement('destin'),
      after: new KeyMapElement('afterComic'),
      ignore: new KeyMapElement('ignoredPatterns', []),
      style: new KeyMapElement('style'),
      wrapperStyle: new KeyMapElement('wrapperStyle'),
    }

    super(config, configKeyMap)
  }
}
class PostComicWrapper {
  constructor(comicNode, rule, style) {
    this.comicNode = comicNode
    this.rule = rule
    this.style = style
  }

  // create an wrapper element in which to put the copied content
  get node() {
    // if the node is known, return it
    if (this._node) {
      return this._node
    } else {
      this._node = document.createElement('div')
      this._node.setAttribute('class', 'proclivity-wrapper')

      let targetNode
      if (this.rule.destin !== undefined && this.rule.destin.select) {
        targetNode = document.querySelector(this.rule.destin.select)

        if (targetNode) {
          // sibling nodes
          if (this.rule.destin.insert === 'before') {
            targetNode.parentNode.insertBefore(this._node, targetNode)
          } else if (this.rule.destin.insert === 'after') {
            targetNode.parentNode.insertBefore(
              this._node,
              targetNode.nextSibling,
            )

            // parent nodes
          } else if (this.rule.destin.insert === 'prepend') {
            targetNode.prepend(this._node)
          } else if (this.rule.destin.insert === 'append') {
            targetNode.appendChild(this._node)

            // failsafe if no match
          } else {
            targetNode = undefined
          }
        }
      }
      if (!targetNode) {
        // place the created element after the comic
        this.comicNode.parentNode.insertBefore(
          this._node,
          this.comicNode.nextSibling,
        )
      }

      // add a class to the created element to temporarily hide it until processing is done
      this._node.classList.add('proclivity-wip')

      return this._node
    }
  }

  set altText(data) {
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
    if (this.rule.style) {
      // build CSS rules to be added later
      this.style.addRule('.proclivity-wrapper > p', this.rule.style)
    }
  }

  set afterComic(node) {
    if (!document.querySelector('#proclivity-after-comic')) {
      node.setAttribute('id', 'proclivity-after-comic')

      // create a wrapper since we don't want it inline with the static caption
      let afterComicWrapper = document.createElement('div')
      afterComicWrapper.appendChild(node)

      // place the post-comic content within the wrapper
      this.node.insertAdjacentHTML('beforeend', afterComicWrapper.outerHTML)
    }
  }

  apply() {
    // add class to wrapper for styling
    this.node.classList.add('proclivity-wrapper')
    // set the wrapper width to the comic width
    if (this.rule.wrapperStyle) {
      console.log(this.rule)
      this.style.addRule('.proclivity-wrapper', this.rule.wrapperStyle)
    }
    this.style.addRule(
      '.proclivity-wrapper',
      'width:' + this.comicNode.width + 'px; margin: 0 auto',
    )
    // remove the temporary class to reveal it on the page
    this.node.classList.remove('proclivity-wip')
  }

  clear() {
    this.node.innerHTML = ''
  }
}
class Comic {
  constructor(node, rule, style) {
    this.node = node
    this.rule = rule
    this.style = style

    this.postComicWrapper = new PostComicWrapper(node, rule, style)
    this.afterComicNode = document.querySelector(rule.afterComic)
  }

  get altText() {
    // if alt-text is already defined, return it
    if (this._altText) {
      return this._altText

      // otherwise, find it
    } else {
      let data = DOMPurify.sanitize(this.node.getAttribute('title'))
      // if title text doesn't match the ignored regex
      if (data && !this._inIgnoreList(data)) {
        this._altText = data
      }
      return this._altText
    }
  }

  _inIgnoreList(data) {
    // check if alt-text matches any ignored patterns (as listed in the ruleset)
    if (this.rule.ignoredPatterns) {
      for (let i = this.rule.ignoredPatterns.length - 1; i >= 0; i--) {
        // use RegEx to test for the patterns
        let ignoredPattern = new RegExp(this.rule.ignoredPatterns[i], 'g')
        // if a match is found, return true
        if (data.search(ignoredPattern) !== -1) {
          return true
        }
      }
    }
    return false
  }

  process() {
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

// expansion element stuffs
class ExpansionRule extends KeyMap {
  constructor(config) {
    let configKeyMap = {
      source: new KeyMapElement('sourcePath'),
      destin: new KeyMapElement('destinationPath'),
      prefix: new KeyMapElement('contentPrefix'),
      suffix: new KeyMapElement('contentSuffix'),
      style: new KeyMapElement('style'),
      type: new KeyMapElement('type'),
    }
    super(config, configKeyMap)
  }
}
class Expansion {
  constructor(sourceNode, destinationNode, rule) {
    this.sourceNode = sourceNode
    this.destinationNode = destinationNode
    this.rule = rule
  }

  process() {
    // if the target is a link...
    if (this.rule.type === 'link' && this.sourceNode.tagName == 'A') {
      // get link
      let link = new URL(this.sourceNode.getAttribute('href'))
      // get file extension from link
      let ext = link.pathname.split('.').slice(-1).pop().toLowerCase()
      // check if it's in the approved image extensions
      if (ext in IMG_TYPES) {
        // build the destination node contents as an node utilizing the link (usually as an img source)
        this.destinationNode.innerHTML = [
          // contentPrefix usually contains something like <img src="
          this.rule.contentPrefix,
          DOMPurify.sanitize(link.href),
          // contentSuffix usually contains something like " />
          this.rule.contentSuffix,
        ].join('')
        // otherwise, if it's a YouTube link
      } else if (parseBaseUrl(link.host) === 'youtube.com') {
        // TODO: implement YouTube imbeds
      }
      // otherwise (usually if it's just plain text)
    } else {
      // create the node with the set prefixes and suffixes
      this.destinationNode.innerHTML = [
        this.rule.contentPrefix,
        // can't sanitize using encoding since subelements are allowed and often expected
        DOMPurify.sanitize(this.sourceNode.innerHTML),
        this.rule.contentSuffix,
      ].join('')
    }
  }

  apply() {
    this.process()

    // remove the expansion source if it still exists and hasn't already been directly replaced by the expansion rule
    if (
      document.body.contains(this.sourceNode) &&
      this.rule.sourcePath !== this.rule.destinationPath
    ) {
      this.sourceNode.parentNode.removeChild(this.sourceNode)
    }
  }
}
class ExpansionSet {
  constructor(rule, style) {
    this.rule = rule
    this.style = style

    this.id = '_' + Math.random().toString(36).substr(2, 9)
    this.sourceNodes = document.querySelectorAll(rule.sourcePath)
    this.destinationNodes = document.querySelectorAll(rule.destinationPath)
  }

  process() {
    this.sources = []
    if (
      this.sourceNodes &&
      this.sourceNodes.length === this.destinationNodes.length
    ) {
      for (let i = this.sourceNodes.length - 1; i >= 0; i--) {
        let sourceNode = this.sourceNodes[i]
        let destinationNode = this.destinationNodes[i]
        destinationNode.classList.add('proclivity-expansion' + this.id)

        let source = new Expansion(sourceNode, destinationNode, this.rule)
        this.sources.push(source)
        source.apply()
      }
      if (this.rule.style) {
        this.style.addRule('.proclivity-expansion' + this.id, this.rule.style)
      }
    }
  }
}

// website stuffs
class ComicWebsite extends KeyMap {
  constructor(siteData, config, webcomicSite) {
    let configKeyMap = {
      nav: new KeyMapElement('navSelectors', {}),
      alt: new KeyMapElement('altRules', []),
      exp: new KeyMapElement('expansionRules', []),
      sty: new KeyMapElement('styleRules', []),
    }
    super(siteData, configKeyMap)

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
    this.style = new Style()
    this.initialize()
  }

  initialize() {
    // need to get nav up as soon as possible — this may fail sometimes due to DOM not being fully loaded, so it's repeated after the DOM has loaded
    // this method is idempotent, so it can be called multiple times without adverse affect
    this.loadUnfinished()

    // set up canary variables in case the page loads too fast to catch specific readyStates
    var preLoaded = false
    var postLoaded = false

    browser.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request === 'urlchanged') {
          this.refreshComic()
        }
      }.bind(this),
    )

    document.addEventListener(
      'readystatechange',
      function (e) {
        // when HTML/DOM elements are ready:
        if (e.target.readyState !== 'loading' && !preLoaded) {
          // load things that are content-independent (e.g. nav)
          this.loadUnfinished()
          preLoaded = true
        }
        // when window loaded ( external resources are loaded too- `css`,`src`, etc...)
        if (e.target.readyState === 'complete' && !postLoaded) {
          // load any remainders that were missed above
          if (!preLoaded) {
            this.loadUnfinished()
            preLoaded = true
          }

          // load things that are content-dependent (e.g. alt-text)
          this.loadFinished()
          postLoaded = true
        }
      }.bind(this),
    )

    // if document already fully finished loading before listeners could be added, load everything
    // also allow for skipWait if sites have slow loading times but don't need full DOM to render (e.g. qwantz.com)
    if (document.readyState === 'complete') {
      // load any remainders that were missed above
      if (!preLoaded) {
        this.loadUnfinished()
      }
      if (!postLoaded) {
        this.loadFinished()
      }
      preLoaded = true
      postLoaded = true
    }
  }

  // things that should occur before the page finishes loading
  loadUnfinished() {
    this.nav = this.createNav()
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
  loadFinished() {
    // copy alt-text if enabled globally and locally and if the alt selectors exist
    if (this.enableAltGlobal && this.enableAltLocal && this.altRules) {
      this.processAltText()
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

  createNav() {
    let rule = new NavigationRule(this.navSelectors)
    return new Navigation(rule, this.nextCombo, this.prevCombo)
  }

  reset() {
    for (let i = this.comicNodes.length - 1; i >= 0; i--) {
      let comicNode = this.comicNodes[i]
      // remove the post-comic wrapper contents
      comicNode.postComicWrapper.clear()
    }
    // reset generated styles
    this.style.reset()
  }

  // refresh comic in case this is a single-page app (e.g. DaisyOwl); will get interrupted on DOM reload for non-single-page sites
  refreshComic() {
    this.reset()
    // re-run the items that are generated after page load — include items before load finishes for single-page apps where nav elements might change
    this.loadUnfinished()
    this.loadFinished()

    // re-send message to update progress, since everything is already applied (i.e. single-page app), don't need to worry about the response
    browser.runtime.sendMessage({ popup: false }).then((_) => {})
  }

  addStyles() {
    for (var i = this.styleRules.length - 1; i >= 0; i--) {
      let styleRule = this.styleRules[i]
      this.style.addRule(styleRule.destin, styleRule.styles)
    }
  }

  // copy alt-text to below the comic
  processAltText() {
    this.comicNodes = []
    // copy alt-text
    for (let i = this.altRules.length - 1; i >= 0; i--) {
      let altRule = new ComicRule(this.altRules[i])

      // get the comic image elements
      let comics = document.querySelectorAll(altRule.comic)
      // add the elements to the list and process them
      for (let i = comics.length - 1; i >= 0; i--) {
        let comic = new Comic(comics[i], altRule, this.style)
        this.comicNodes.push(comic)
        comic.process()
      }
    }
  }

  // expand drop-down text and images (e.g. XKCD's What-If and SMBC)
  processExpansions() {
    this.expansionSets = []
    // for each expansion rule, generate rule and set objects then process
    for (let i = this.expansionRules.length - 1; i >= 0; i--) {
      let expansionRule = new ExpansionRule(this.expansionRules[i])

      let expansionSet = new ExpansionSet(expansionRule, this.style)
      this.expansionSets.push(expansionSet)
      expansionSet.process()
    }
  }
}

// process the global page's response
function handleResponse(response) {
  // if globally disabled, bypass all logic and skip
  if (!response.config.globalEnabled) {
    return
  }

  // do progress redirect here if enabled for the fastest turnaround time
  let path = location.pathname + location.search
  if (
    response.config.globalAutoSaveProgress &&
    response.config['siteAutoSaveProgress_' + response.webcomicSite] &&
    path !== response.autoSavedUrl &&
    path === response.sitePath
  ) {
    // use .replace() so no history is generated
    location.replace(response.autoSavedUrl)
    // don't return since single-page apps won't need a refresh
  }

  // pass the rules to the comic class
  let site = new ComicWebsite(
    response.siteData,
    response.config,
    response.webcomicSite,
  )
}

// send a message to the background page to get rules from the domain
browser.runtime.sendMessage({ popup: false }).then(handleResponse)
