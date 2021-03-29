// import psl from 'psl'

// format for a site rule; ANY non-applicable sections can be omitted
// "[domain, minus 'www']": {
//     "[comic path prefix]": {
//         "skipIndex": [boolean], // skip showing comic in the option page list of comics
//         "name": "[comic name]",
//         "nsfw": [boolean], // mark webcomic as not safe for work
//         "indexUrl": "[full path to index, including domain; used for the option page link]",
//         "nav": { // rules for implementing keyboard navigation
//             "useParentLevel": [#] // number of levels above the selector that should be used (since no parent selector exists)
//             "prev": "[selector to the 'next' button]",
//             "next": "[selector to the 'prev' button]",
//         },
//         "alt": { // rules for copying alt-text
//             "comic": "[selector for the comic images with alt-text, ok to select multiple elements]",
//             "destin": { // will go directly after comic if omitted
//                 "select": [selector for the element to put the alt-text]",
//                 "insert": "[before|after|prepend|append]"
//             }
//             "ignore": [
//                 "[regex pattern to ignore; if matched, no alt-text will be copied]"
//             ],
//             "after": "[selector for after-comic, will be appended to alt-text element]",
//             "style": "[css styles to apply to generated static alt-text",
//         },
//         "exp": [ // rules for expanding elements in-place
//             {
//                 "source": "[selector for the element to be expanded]",
//                 "destin": "[selector for the expansion destination, can be the same as 'source']",
//                 "prefix": "[expansion prefix, can be HTML code]",
//                 "suffix": "[expansion suffix, can be HTML code]",
//                 "style": "[css styles to apply to generated expanded element]",
//                 "type": "link", // omit if not applicable; assumes element to be expanded is a link — if the source file link ends with a supported image type, it'll copy it
//             },
//             ...
//         ],
//         "sty": [
//             {
//                 "destin": "[css selector]",
//                 "styles": "[css styles]",
//             },
//             ...
//         ],
//         "autoSave": {
//             "allow": /[regex pattern to match, if matched, page will be saved in progress]/g,
//             "ignore": /[regex pattern to ignore, overrides 'pattern']/g,
//         }
//     }
// }

const siteRules = {
  'beefpaper.com': {
    '/': {
      name: 'Beefpaper',
      indexUrl: 'http://beefpaper.com/',
      nav: {
        prev: '.comic-nav-previous',
        next: '.comic-nav-next',
      },
      alt: [
        {
          comic: '#comic img',
          style: 'color: black;',
        },
      ],
      autoSave: {
        allow: /comic\/.*\//g,
      },
    },
  },
  'bunny-comic.com': {
    '/': {
      name: 'Bunny',
      indexUrl: 'http://www.bunny-comic.com/',
      nav: {
        prev: '#navigator a:nth-child(2)',
        next: '#navigator a:nth-child(3)',
      },
      alt: [
        {
          comic: '#strip a:nth-child(2) img',
          destin: {
            select: '#strip > .comic',
            insert: 'before',
          },
          style: 'padding-bottom: 0; margin-bottom: -20px;',
        },
      ],
      autoSave: {
        allow: /[0-9]+\.html/g,
      },
    },
  },
  'buttersafe.com': {
    '/': {
      name: 'Buttersafe',
      indexUrl: 'https://www.buttersafe.com/',
      nav: {
        prev: 'a[rel=prev]',
        next: 'a[rel=next]',
      },
      autoSave: {
        allow: /[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+/g,
      },
    },
  },
  'collectedcurios.com': {
    '/sequentialart.php': {
      name: 'Sequential Art',
      indexUrl: 'https://collectedcurios.com/sequentialart.php',
      nav: {
        prev: '#nav > a:nth-of-type(3)',
        next: '#nav > a:nth-of-type(4)',
      },
      autoSave: {
        allow: /\?s=[0-9]+/g,
      },
    },
    '/battlebunnies.php': {
      skipIndex: true,
      name: 'Battle Bunnies',
      indexUrl: 'https://collectedcurios.com/battlebunnies.php',
      nav: {
        prev: '#nav > a:nth-of-type(3)',
        next: '#nav > a:nth-of-type(4)',
      },
      autoSave: {
        allow: /\?s=[0-9]+/g,
      },
    },
    '/spiderandscorpion.php': {
      skipIndex: true,
      name: 'Spider & Scorpion',
      indexUrl: 'https://collectedcurios.com/spiderandscorpion.php',
      nav: {
        prev: '#nav > a:nth-of-type(3)',
        next: '#nav > a:nth-of-type(4)',
      },
      autoSave: {
        allow: /\?s=[0-9]+/g,
      },
    },
  },
  'daisyowl.com': {
    '/': {
      name: 'Daisy Owl',
      indexUrl: 'https://daisyowl.com/',
      nav: {
        prev: '.nav > *:first-child',
        next: '.nav > *:last-child',
      },
      alt: [
        {
          comic: '.main img',
          style:
            'text-align: center; padding: 7px; margin: 0 0 20px; font-size: 1.2em; margin-top: -2em;',
        },
      ],
      autoSave: {
        allow: /comic\/[0-9]{4}-[0-9]{2}-[0-9]{2}\/?/g,
      },
    },
  },
  'dieselsweeties.com': {
    '/archive': {
      skipIndex: true,
      name: 'diesel sweeties (archive)',
      indexUrl: 'https://www.dieselsweeties.com/',
      nav: {
        next: 'a[title="read the next webcomic"]',
        prev: 'a[title="read the previous webcomic"]',
      },
      autoSave: {
        allow: /\/[0-9]+/g,
      },
    },
    '/': {
      name: 'diesel sweeties',
      indexUrl: 'https://www.dieselsweeties.com/',
      nav: {
        next: '#wrapmore a:first-child',
        prev: '#wrapmore a:nth-child(3)',
      },
      autoSave: {
        allow: /ics\/[0-9]+\//g,
      },
    },
  },
  'qwantz.com': {
    '/': {
      name: 'Dinosaur Comics',
      indexUrl: 'https://qwantz.com/',
      nav: {
        prev: 'a[rel=prev]',
        next: 'a[rel=next]',
      },
      alt: [
        {
          comic: 'img.comic',
          style:
            'text-align: center; background: rgba(255,255,255,.8); padding: 7px; margin: 7px 0;',
        },
      ],
      autoSave: {
        allow: /index\.php\?comic=[0-9]+/g,
      },
    },
  },
  'doodleforfood.com': {
    '/': {
      name: 'Doodle for Food',
      indexUrl: 'https://www.doodleforfood.com/',
      nav: {
        prev: 'a.previous-button',
        next: 'a.next-button',
      },
      autoSave: {
        allow: /page\/[0-9]+\/?/g,
      },
    },
  },
  'drmcninja.com': {
    '/': {
      name: 'Dr. McNinja',
      indexUrl: 'http://drmcninja.com/',
      nav: {
        prev: '.prepostnav > a.prev',
        next: '.prepostnav > a.next',
      },
      alt: [
        {
          comic: '#comic > img',
          ignore: ['[0-9]+?p[0-9]+'],
          style:
            'text-align: center; margin: 1em 0 2em; text-decoration: none !important; font-size: 1.2em;',
        },
      ],
      autoSave: {
        allow: /archives\/comic\/[0-9]{1,2}p[0-9]{1,3}\//g,
      },
    },
  },
  'dresdencodak.com': {
    '/': {
      name: 'Dresden Codak',
      indexUrl: 'https://dresdencodak.com/',
      nav: {
        prev: 'img[alt="Previous"]',
        next: 'img[alt="Next Page"]',
      },
      autoSave: {
        allow: /[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+/g,
      },
    },
  },
  'dumbingofage.com': {
    '/': {
      name: 'Dumbing of Age',
      indexUrl: 'https://www.dumbingofage.com/',
      nav: {
        prev: '.navi-prev',
        next: '.navi-next',
      },
      alt: [
        {
          comic: '#comic .comicpane img',
          style: 'margin-bottom: 20px',
        },
      ],
      autoSave: {
        allow: /[0-9]{4}\/comic\/book-[0-9]{1,2}\/.*\//g,
      },
    },
  },
  'gunnerkrigg.com': {
    '/': {
      name: 'Gunnerkrigg Court',
      indexUrl: 'https://www.gunnerkrigg.com/',
      nav: {
        prev: '.extra > .nav > a.left',
        next: '.extra > .nav > a.right',
      },
      autoSave: {
        allow: /\?p=[0-9]+/g,
      },
    },
  },
  'harkavagrant.com': {
    '/': {
      name: 'Hark! A Vagrant',
      indexUrl: 'http://www.harkavagrant.com/',
      nav: {
        useParentLevel: 1,
        prev: 'a > img[src="buttonprevious.png"]',
        next: 'a > img[src="buttonnext.png"]',
      },
      autoSave: {
        allow: /index\.php\?id=[0-9]+/g,
      },
    },
  },
  'homestuck.com': {
    '/story': {
      name: 'Homestuck',
      indexUrl: 'https://www.homestuck.com/story',
      nav: {
        prev: '.o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a',
        next: '.o_story-nav > div:last-of-type a',
      },
      alt: [
        {
          comic: 'body > div > img',
          style: 'text-align: center; margin: .4em 0 .8em;',
        },
      ],
      exp: [
        {
          source: '.o_chat-log',
          destin: '.o_chat-container',
          style:
            'display: block; line-height: 1.35; font-size: 14px; text-align: left; padding: 16px 32.5px',
        },
        {
          source: '.o_chat-log span a',
          destin: '.o_chat-log span a',
          prefix: '<img src="',
          suffix: '" />',
          style: 'display: inline-block; text-indent: 0;',
          type: 'link',
        },
      ],
      sty: [
        {
          destin: '.o_chat-container span[style*="color: #FFFFFF"]',
          styles: 'background-color: #000;',
        },
        {
          destin: '.o_chat-container br + span',
          styles: 'display: block; padding-left: 34px; text-indent: -34px;',
        },
        {
          destin: '.o_chat-container span, .o_chat-container span *',
          styles: 'vertical-align: top;',
        },
        {
          destin: '.o_chat-container br + span + br',
          styles: 'display: none;',
        },
        {
          destin: '.o_chat-container img',
          styles: 'padding: 3px 0;',
        },
      ],
      autoSave: {
        allow: /\/[0-9]+/g,
      },
    },
    '/problem-sleuth': {
      skipIndex: true,
      name: 'Problem Sleuth',
      indexUrl: 'https://www.homestuck.com/problem-sleuth',
      nav: {
        prev: '.o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a',
        next: '.o_story-nav > div:last-of-type a',
      },
      autoSave: {
        allow: /\/[0-9]+/g,
      },
    },
    '/jailbreak': {
      skipIndex: true,
      name: 'Jailbreak',
      indexUrl: 'https://www.homestuck.com/jailbreak',
      nav: {
        prev: '.o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a',
        next: '.o_story-nav > div:last-of-type a',
      },
      autoSave: {
        allow: /\/[0-9]+/g,
      },
    },
    '/epilogues': {
      skipIndex: true,
      name: 'Homestuck Epilogues',
      indexUrl: 'https://www.homestuck.com/epilogues',
      nav: {
        prev: '.o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a',
        next: '.o_story-nav > div:last-of-type a',
      },
      autoSave: {
        allow: /\/(prologue|meat|candy)\/[0-9]+/g,
      },
    },
  },
  'johnnywander.com': {
    '/barbarous': {
      skipIndex: true,
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/barbarous',
      nav: {
        prev: 'a.cc-prev',
        next: 'a.cc-next',
      },
      autoSave: {
        allow: /\/.+\/?/g,
      },
    },
    '/luckypenny': {
      skipIndex: true,
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/luckypenny',
      nav: {
        prev: 'a.cc-prev',
        next: 'a.cc-next',
      },
      autoSave: {
        allow: /\/.+\/?/g,
      },
    },
    '/autobio': {
      skipIndex: true,
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/autobio',
      nav: {
        prev: 'a.cc-prev',
        next: 'a.cc-next',
      },
      autoSave: {
        allow: /\/.+\/?/g,
      },
    },
    '/fiction': {
      skipIndex: true,
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/fiction',
      nav: {
        prev: 'a.cc-prev',
        next: 'a.cc-next',
      },
      autoSave: {
        allow: /\/.+\/?/g,
      },
    },
    '/': {
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/',
      nav: {
        prev: 'a.cc-prev',
        next: 'a.cc-next',
      },
      autoSave: {
        allow: /comic\/.+\/?/g,
      },
    },
  },
  'jspowerhour.com': {
    '/': {
      name: 'Junior Scientist Power Hour',
      indexUrl: 'https://www.jspowerhour.com/',
      nav: {
        prev: 'a[aria-label="previous"]',
        next: 'a[aria-label="next"]',
      },
      autoSave: {
        allow: /comics\/[0-9]+\/?/g,
      },
    },
  },
  'lackadaisycats.com': {
    '/comic.php': {
      name: 'Lackadaisy Cats',
      indexUrl: 'https://lackadaisycats.com/comic.php',
      nav: {
        prev: '.prev > a',
        next: '.next > a',
      },
      autoSave: {
        allow: /\?comicid=[0-9]+/g,
      },
    },
  },
  'oglaf.com': {
    '/': {
      name: 'Oglaf [NSFW]',
      nsfw: true,
      skipIndex: true,
      indexUrl: 'https://www.oglaf.com/',
      nav: {
        prev: 'a[rel=prev]',
        next: 'a[rel=next',
      },
      alt: [
        {
          comic: 'img#strip',
          destin: {
            select: '.content',
            insert: 'append',
          },
          wrapperStyle:
            'padding: 597px 160px 16px 16px; background-color: #ccc; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;',
          style:
            'text-align: center; margin-bottom: 0; text-decoration: none !important; font-size: 1em;',
        },
      ],
      sty: [
        {
          destin: '.align.btm',
          styles: 'display: none;',
        },
      ],
      autoSave: {
        allow: /.+/g,
        ignore: /archive\//g,
      },
    },
  },
  'hs.hiveswap.com': {
    '/paradoxspace/index.php': {
      skipIndex: true,
      name: 'Paradox Space',
      indexUrl: 'http://hs.hiveswap.com/paradoxspace/index.php',
      nav: {
        prev: 'div.comnavPrev',
        next: 'div.comnavNext',
      },
      autoSave: {
        allow: /\?comic=[0-9]+/g,
      },
    },
  },
  'poorlydrawnlines.com': {
    '/': {
      name: 'Poorly Drawn Lines',
      indexUrl: 'https://poorlydrawnlines.com/',
      nav: {
        prev: 'a[rel=prev]',
        next: 'a[rel=next]',
      },
      autoSave: {
        allow: /comic\/.+/g,
      },
    },
  },
  'prequeladventure.com': {
    '/': {
      name: 'Prequel',
      indexUrl: 'https://www.prequeladventure.com/',
      nav: {
        prev: '.previous > a[rel=prev]',
        next: '.next > a[rel=next]',
      },
      autoSave: {
        allow: /[0-9]{4}\/[0-9]{2}\/.+\//g,
      },
    },
  },
  'questionablecontent.net': {
    '/': {
      name: 'Questionable Content',
      indexUrl: 'https://www.questionablecontent.net/',
      nav: {
        prev: '#comicnav li:nth-child(2) a',
        next: '#comicnav li:nth-child(3) a',
      },
      autoSave: {
        allow: /view\.php\?comic=[0-9]+/g,
      },
    },
  },
  'romanticallyapocalyptic.com': {
    '/': {
      name: 'Romantically Apocalyptic',
      indexUrl: 'https://romanticallyapocalyptic.com/',
      nav: {
        prev: 'a[accesskey=p]',
        next: 'a[accesskey=n]',
      },
      autoSave: {
        allow: /.+/g,
        ignore: /(info|wiki|archives|store|forums|gallery|links|contact|login|join).+/g,
      },
    },
  },
  'samandfuzzy.com': {
    '/': {
      name: 'Sam & Fuzzy',
      indexUrl: 'https://www.samandfuzzy.com/',
      nav: {
        prev: '.prev-page > a',
        next: '.next-page > a',
      },
      autoSave: {
        allow: /[0-9]+\/?/g,
      },
    },
  },
  'smbc-comics.com': {
    '/': {
      name: 'Saturday Morning Breakfast Cereal',
      indexUrl: 'https://www.smbc-comics.com/',
      nav: {
        prev: '.cc-nav .cc-prev',
        next: '.cc-nav .cc-next',
      },
      alt: [
        {
          comic: '#cc-comic',
          after: '#aftercomic img',
          ignore: ['[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'],
          style:
            'text-align: center; margin: 1em 0 .2em; text-decoration: none !important; font-size: 1.2em; color: black; display: inline-block;',
        },
      ],
      autoSave: {
        allow: /comic\/.+\/?/g,
      },
    },
  },
  'amultiverse.com': {
    '/': {
      name: 'Scenes from a Multiverse',
      indexUrl: 'https://amultiverse.com/',
      alt: [
        {
          comic: '#comic img',
          style: 'margin-top: 20px',
        },
      ],
      nav: {
        prev: 'a.comic-nav-previous',
        next: 'a.comic-nav-next',
      },
      autoSave: {
        allow: /comic\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+\//g,
      },
    },
  },
  'somethingpositive.net': {
    '/': {
      name: 'Something Positive',
      indexUrl: 'https://somethingpositive.net/',
      nav: {
        prev: 'body > table tr table tr table table tr table td:nth-child(3) a',
        next: 'body > table tr table tr table table tr table td:nth-child(5) a',
      },
      autoSave: {
        allow: /comic\/.+\//g,
      },
    },
  },
  'threewordphrase.com': {
    '/': {
      name: 'Three Word Phrase',
      indexUrl: 'http://threewordphrase.com/',
      nav: {
        prev: 'img[src="/prevlink.gif"]',
        next: 'img[src="/nextlink.gif"]',
      },
      autoSave: {
        allow: /.+/g,
        ignore: /(archive|index).htm/g,
      },
    },
  },
  'what-if.xkcd.com': {
    '/': {
      name: 'What If?',
      indexUrl: 'https://what-if.xkcd.com/',
      nav: {
        prev: '.nav-prev > a',
        next: '.nav-next > a',
      },
      alt: [
        {
          comic: 'img.illustration',
          style:
            'text-align: center; margin: 0 auto; text-decoration: none !important; font-style: oblique; line-height: 1.2em; font-size: 16px;',
        },
      ],
      exp: [
        {
          source: '.refbody',
          destin: '.refnum',
          prefix: ' [',
          suffix: '] ',
          style:
            'bottom: 0; text-decoration: none; cursor: default; font-size: .75em;',
        },
      ],
      autoSave: {
        allow: /[0-9]+\//g,
      },
    },
  },
  'wildelifecomic.com': {
    '/': {
      name: 'Wilde Life',
      indexUrl: 'https://www.wildelifecomic.com/',
      nav: {
        prev: 'a.cc-prev',
        next: 'a.cc-next',
      },
      alt: [
        {
          comic: '#cc-comicbody img',
          ignore: ['[0-9]+'],
          style:
            'text-align: center; background: rgba(255,255,255,.8); margin: 0;padding: 12px;',
        },
      ],
      autoSave: {
        allow: /comic\/[0-9]+/g,
      },
    },
  },
  'wondermark.com': {
    '/': {
      name: 'Wondermark',
      indexUrl: 'https://wondermark.com/',
      nav: {
        prev: '.comic-nav-previous a',
        next: '.comic-nav-next a',
      },
      alt: [
        {
          comic: '#comic img',
          style: 'margin-bottom: 5px;',
        },
      ],
      autoSave: {
        allow: /c?[0-9]+\/?/g,
      },
    },
  },
  'xkcd.com': {
    '/': {
      name: 'xkcd',
      indexUrl: 'https://xkcd.com/',
      nav: {
        prev: '.comicNav a[rel=prev]',
        next: '.comicNav a[rel=next]',
      },
      alt: [
        {
          comic: '#comic img',
          style:
            'text-align: center; margin: 7px auto 30px; text-decoration: none !important;',
        },
      ],
      autoSave: {
        allow: /[0-9]+\//g,
      },
    },
  },
}

// helpers
function escapeString(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
function parseBaseUrl(url) {
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
}

// globals
const indexSiteList = []
const siteMatchRules = []
for (const [domain, value] of Object.entries(siteRules)) {
  for (const [subkey, subvalue] of Object.entries(value)) {
    let escapedDomain = escapeString(domain)
    let rule = RegExp('https?://.*?.?' + escapedDomain + '/.*')
    siteMatchRules.push(rule)

    if (!subvalue.skipIndex) {
      indexSiteList.push({ name: subvalue.name, url: subvalue.indexUrl })
    }
  }
}

// add message listeners
browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request === 'indexSiteList') {
      return new Promise((resolve) => {
        resolve(indexSiteList)
      })
    }

    let rootDomain = parseBaseUrl(sender.origin)
    let urlObj = new URL(sender.tab.url)
    let path = urlObj.pathname + urlObj.search
    // need to check if it's a popup AND if it's from the chrome extension domain
    if (request.popup === true && rootDomain === 'chrome-extension:') {
      rootDomain = parseBaseUrl(request.domain)
      path = request.path
    }
    if (rootDomain in siteRules) {
      let webcomicSite = rootDomain

      let domainData = siteRules[webcomicSite]

      let sitePath
      let siteData
      // test each comic on a host to see if the path starts with the appropriate string
      for (let key in domainData) {
        if (path.startsWith(key)) {
          sitePath = key
          webcomicSite += key
          siteData = domainData[key]
          break
        }
      }
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
      if (!sitePath || !siteData) {
        return browser.storage.sync.get(globalDefaults).then(function (items) {
          return { config: items }
        })
      }

      let siteDefaults = {
        ['siteKeyboardNav_' + webcomicSite]: true,
        ['siteStaticCaptions_' + webcomicSite]: true,
        ['siteTextboxExpansion_' + webcomicSite]: true,
        ['siteCustomStyles_' + webcomicSite]: true,
        ['siteProgressManualSaved_' + webcomicSite]: null,
        ['siteAutoSaveProgress_' + webcomicSite]: true,
        ['siteProgressAutoSaved_' + webcomicSite]: path,
      }
      let defaults = { ...globalDefaults, ...siteDefaults }

      return browser.storage.sync.get(defaults).then(function (items) {
        if (!items.globalEnabled && !request.popup) {
          return { config: { globalEnabled: false } }
        }

        let autoSavedKey = 'siteProgressAutoSaved_' + webcomicSite
        let autoSavedUrl = items[autoSavedKey]
        delete items[autoSavedKey]

        if (
          items['globalEnabled'] &&
          items['globalAutoSaveProgress'] &&
          items['siteAutoSaveProgress_' + webcomicSite] &&
          siteData.autoSave.allow
        ) {
          if (!request.popup) {
            let allowProgressSave = false
            let escapedSitePath = escapeString(sitePath)

            if (siteData.autoSave.allow) {
              let regex = new RegExp(
                // autoSave.allow.source is a part of RegExp, not a typo
                escapedSitePath + siteData.autoSave.allow.source,
              )
              allowProgressSave = regex.test(path)
            }

            if (allowProgressSave && siteData.autoSave.ignore) {
              let regex = new RegExp(
                // autoSave.ignore.source is a part of RegExp, not a typo
                escapedSitePath + siteData.autoSave.ignore.source,
              )
              allowProgressSave = !regex.test(path)
            }

            if (allowProgressSave) {
              // we don't care that we're saving the auto-saved progress after retrieval because:
              // a) retrieving only matters when accessing the index
              // b) setting only occurs when accessing a non-index
              browser.storage.sync
                .set({
                  ['siteProgressAutoSaved_' + webcomicSite]: path,
                })
                .then(() => {})
            }
          }
        }

        return {
          siteData: siteData,
          config: items,
          webcomicSite: webcomicSite,
          sitePath: sitePath,
          autoSavedUrl: autoSavedUrl,
        }
      })
    }
  }.bind(siteRules),
)

// add tab state change listener since single-page apps are very difficult to listen to from within the content script
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // check if url changed
  if (changeInfo.url) {
    browser.tabs.sendMessage(tabId, 'urlchanged').catch((e) => {})
  }

  // only do this after complete  to reduce needless iterations
  // declarativeContent replacement since it's only supported in Chrome
  let urlObj = new URL(tab.url)
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
browser.storage.onChanged.addListener(
  function (changes, namespace) {
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
      browser.tabs.query({ url: patterns }).then(function (tabs) {
        // reload tabs (no batch command, need to do it one-by-one)
        for (let i in tabs) {
          let tab = tabs[i]
          browser.tabs.reload(tab.id)
        }
      })
    }
  }.bind(siteRules),
)
