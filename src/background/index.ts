import {
  IndexSite,
  SiteMeta,
  SiteRuleRequest,
  SiteRuleResponse,
  UserSettings,
  WebcomicRules,
  Webcomics,
} from '@src/types'
import { siteRules } from './sites'

// helpers
function escapeString(string: string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
function parseBaseUrl(url: string) {
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
}

// globals
const indexSiteList: IndexSite[] = []
const siteMatchRules: RegExp[] = []
for (const [domain, value] of Object.entries(siteRules)) {
  // using curly braces instead of var name is similar to Python's "_"
  for (const [{}, subvalue] of Object.entries(value)) {
    // add site match rules (used for declarativeContent substitute)
    let escapedDomain = escapeString(domain)
    let rule = RegExp('https?://.*?.?' + escapedDomain + '/.*')
    siteMatchRules.push(rule)

    // add site to the index list
    if (!subvalue.skipIndex) {
      indexSiteList.push({ name: subvalue.name, url: subvalue.indexUrl })
    }
  }
}

// listener functions
function returnResponse(
  request: string | SiteRuleRequest,
  sender: any, // tab info from the browser
  sendResponse: any, // deprecated, not used
): Promise<IndexSite[]> | Promise<SiteRuleResponse> | undefined {
  if (request === 'indexSiteList') {
    return promiseSiteList()
  }

  let requestMeta = generateRequestMeta(request, sender)
  if (requestMeta.rootDomain in siteRules) {
    return promiseSiteRules(requestMeta)
  }

  return
}

//
function promiseSiteList(): Promise<IndexSite[]> {
  return new Promise((resolve) => {
    resolve(indexSiteList)
  })
}

// request meta info
interface RequestMeta {
  readonly rootDomain: string
  readonly path: string
  readonly popup: boolean
}
function generateRequestMeta(request: any, sender: any): RequestMeta {
  let rootDomain: string = parseBaseUrl(sender.origin)
  let path: string = ''
  let popup: boolean = false

  // if from popup, no tab property will exist
  if (sender.tab) {
    let urlObj = new URL(sender.tab.url)
    path = urlObj.pathname + urlObj.search

    // need to check if it's a popup AND if it's from the chrome extension domain (security check)
    // security check since it depends on the popup to return the URL, domain, and path — can't do this for the injected content since that environment should be considered untrusted
  } else if (rootDomain === 'chrome-extension:' && request.popup === true) {
    popup = true

    rootDomain = parseBaseUrl(request.domain)
    path = request.path
  }

  return { rootDomain: rootDomain, path: path, popup: popup }
}

// promise to return site rules
function promiseSiteRules(requestMeta: RequestMeta): Promise<SiteRuleResponse> {
  let siteMeta = getSiteMeta(requestMeta)

  // if sitePath or siteData don't exist, skip rest of processing
  let globalDefaults = {
    globalEnabled: true,
    globalNextCombo: ['right'],
    globalPrevCombo: ['left'],
    globalKeyboardNav: true,
    globalStaticCaptions: true,
    globalTextboxExpansion: true,
    globalCustomStyles: true,
    globalAutoSaveProgress: true,
  }
  if (!siteMeta.exists) {
    // this browser API returns a Promise
    return browser.storage.sync.get(globalDefaults).then(function (items) {
      return { config: items }
    })
  }

  let siteDefaults = {
    ['siteKeyboardNav_' + siteMeta.coreUrl]: true,
    ['siteStaticCaptions_' + siteMeta.coreUrl]: true,
    ['siteTextboxExpansion_' + siteMeta.coreUrl]: true,
    ['siteCustomStyles_' + siteMeta.coreUrl]: true,
    ['siteProgressManualSaved_' + siteMeta.coreUrl]: null,
    ['siteAutoSaveProgress_' + siteMeta.coreUrl]: true,
    ['siteProgressAutoSaved_' + siteMeta.coreUrl]: siteMeta.path,
  }
  let defaults = { ...globalDefaults, ...siteDefaults }

  return browser.storage.sync
    .get(defaults)
    .then(function (settings: UserSettings) {
      if (!settings.globalEnabled && !requestMeta.popup) {
        return { config: { globalEnabled: false } }
      }

      saveProgress(requestMeta, siteMeta, settings)

      return {
        config: settings,
        siteMeta: siteMeta,
      }
    })
}

function getSiteMeta(requestMeta: RequestMeta): SiteMeta {
  let domainData: Webcomics = siteRules[requestMeta.rootDomain]
  let coreUrl: string = requestMeta.rootDomain

  let exists: boolean = false
  let path: string | null = null
  let data: WebcomicRules | null = null
  // test each comic on a host to see if the path starts with the appropriate string
  for (let key in domainData) {
    // this is fast, but necessitates that "/" come last in the dict
    if (requestMeta.path.startsWith(key)) {
      exists = true
      path = key
      coreUrl += key
      data = domainData[key]
      break
    }
  }

  return { coreUrl: coreUrl, path: path, data: data, exists: exists }
}

function saveProgress(
  requestMeta: RequestMeta,
  siteMeta: SiteMeta,
  settings: UserSettings,
): void {
  // skip if popup, disabled, or no rule exists
  if (
    requestMeta.popup === true ||
    !settings['globalEnabled'] ||
    !settings['globalAutoSaveProgress'] ||
    !settings['siteAutoSaveProgress_' + siteMeta.coreUrl] ||
    !siteMeta.data ||
    !siteMeta.data.autoSave ||
    !siteMeta.data.autoSave.allowedPattern
  ) {
    return
  }

  let allowProgressSave = false
  let escapedSitePath = escapeString(siteMeta.path as string)

  // autoSave property exists and has an allow rule
  if (siteMeta.data.autoSave && siteMeta.data.autoSave.allowedPattern) {
    let regex = new RegExp(
      // .source is a part of RegExp, not a typo
      escapedSitePath + siteMeta.data.autoSave.allowedPattern.source,
    )
    allowProgressSave = regex.test(requestMeta.path)
  }

  // allowed so far and has an ignore rule
  if (allowProgressSave && siteMeta.data.autoSave.ignoredPattern) {
    let regex = new RegExp(
      // .source is a part of RegExp, not a typo
      escapedSitePath + siteMeta.data.autoSave.ignoredPattern.source,
    )
    allowProgressSave = !regex.test(requestMeta.path)
  }

  // allowed according to rules above
  if (allowProgressSave) {
    // we don't care that we're saving the auto-saved progress after retrieval because:
    // a) retrieving only matters when accessing the index
    // b) setting only occurs when accessing a non-index
    browser.storage.sync
      .set({
        ['siteProgressAutoSaved_' + siteMeta.coreUrl]: requestMeta.path,
      })
      .then(() => {})
  }
}

// add message listeners
browser.runtime.onMessage.addListener(returnResponse)

// add tab state change listener since single-page apps are very difficult to listen to from within the content script
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // check if url changed
  if (changeInfo.url) {
    browser.tabs.sendMessage(tabId, 'urlchanged').catch((e) => {})
  }

  // only do this after complete  to reduce needless iterations
  // declarativeContent replacement since it's only supported in Chrome
  let urlObj = new URL(tab.url as string)
  if (
    changeInfo.status === 'complete' &&
    parseBaseUrl(urlObj.hostname) in siteRules
  ) {
    browser.pageAction.show(tabId)
  } else {
    // hide if no rules matched
    browser.pageAction.hide(tabId)
  }
})

// add storage listener to reload sites on change
// TODO: replace tab reloading with dynamic enabling/disabling
browser.storage.onChanged.addListener((changes, namespace) => {
  let patterns = []

  for (let key in changes) {
    if (
      changes[key].oldValue === changes[key].newValue ||
      // exclude progress saves from auto-reload
      key.startsWith('siteProgressAutoSaved') ||
      key.startsWith('siteProgressManualSaved')
    ) {
      continue
    }

    // if a global setting
    if (key.startsWith('global')) {
      for (let domain in siteRules) {
        let pattern = '*://*.' + domain + '/*'
        patterns.push(pattern)
      }
      break

      // if a site-specific setting
    } else if (key.startsWith('site')) {
      let webcomicSite = key.split('_').slice(-1)
      let pattern = '*://*.' + webcomicSite + '*'
      patterns.push(pattern)
    }
  }

  // need to explicitly use a conditional here, otherwise all tabs will be returned on query, causing a reload storm if multiple webcomic tabs are open
  if (patterns.length > 0) {
    // url can be a list of strings
    browser.tabs.query({ url: patterns }).then((tabs) => {
      // reload tabs (no batch command, need to do it one-by-one)
      for (let i in tabs) {
        let tab = tabs[i]
        browser.tabs.reload(tab.id as number)
      }
    })
  }
})
