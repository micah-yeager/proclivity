// import psl from 'psl'


const siteRules = {
    "buttersafe.com": {
        "name": "Buttersafe",
        "index": "https://www.buttersafe.com/",
        "nav": {
            "prev": "a[rel=prev]",
            "next": "a[rel=next]"
        }
    },
    "daisyowl.com": {
        "name": "Daisy Owl",
        "index": "https://daisyowl.com/",
        "nav": {
            "prev":  ".nav > *:first-child",
            "next":  ".nav > *:last-child"
        },
        "alt": [{
            "comic": ".main img",
            "style": "text-align: center; padding: 7px; margin: 0 0 20px; font-size: 1.2em; margin-top: -2em;"
        }]
    },
    "qwantz.com": {
        "name": "Dinosaur Comics",
        "index": "https://qwantz.com/",
        "nav": {
            "prev":  "a[rel=prev]",
            "next":  "a[rel=next]"
        },
        "alt": [{
            "comic": "img.comic",
            "style": "text-align: center; background: rgba(255,255,255,.8); padding: 7px; margin: 7px 0;"
        }]
    },
    "drmcninja.com": {
        "name": "Dr. McNinja",
        "index": "http://drmcninja.com/",
        "nav": {
            "prev":  ".prepostnav > a.prev",
            "next":  ".prepostnav > a.next"
        },
        "alt": [{
            "comic": "#comic > img",
            "ignore": ["[0-9]+?p[0-9]+"],
            "style": "text-align: center; margin: 1em 0 2em; text-decoration: none !important; font-size: 1.2em;"
        }]
    },
    "dresdencodak.com": {
        "name": "Dresden Codak",
        "index": "https://dresdencodak.com/",
        "nav": {
            "prev": "img[alt=\"Previous\"]",
            "next": "img[alt=\"Next Page\"]"
        }
    },
    "gunnerkrigg.com": {
        "name": "Gunnerkrigg Court",
        "index": "https://www.gunnerkrigg.com/",
        "nav": {
            "prev": ".extra > .nav > a.left",
            "next": ".extra > .nav > a.right"
        }
    },
    "harkavagrant.com": {
        "name": "Hark! A Vagrant",
        "index": "http://www.harkavagrant.com/",
        "nav": {
            "useParentLevel": 1,
            "prev": "a > img[src=\"buttonprevious.png\"]",
            "next": "a > img[src=\"buttonnext.png\"]"
        }
    },
    "homestuck.com": {
        "name": "Homestuck",
        "index": "https://www.homestuck.com/",
        "nav": {
            "prev": ".o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a",
            "next": ".o_story-nav > div:last-of-type a"
        },
        "alt": [{
            "comic": "body > div > img",
            "style": "text-align: center; margin: .4em 0 .8em;"
        }],
        "exp": [
            {
                "source": ".o_chat-log",
                "destin": ".o_chat-container",
                "style": "display: block; line-height: 1.35; font-size: 14px; text-align: left; padding: 16px 32.5px"
            }, {
                "source": ".o_chat-log span a",
                "destin": ".o_chat-log span a",
                "prefix": "<img src=\"",
                "suffix": "\" />",
                "style": "display: inline-block; text-indent: 0;",
                "type": "link",
            }
        ],
        "sty": [
            {
                "destin": ".o_chat-container span[style*=\"color: #FFFFFF\"]",
                "styles": "background-color: #000;"
            }, {
                "destin": ".o_chat-container br + span",
                "styles": "display: block; padding-left: 26px; text-indent: -26px;"
            }, {
                "destin": ".o_chat-container span, .o_chat-container span *",
                "styles": "vertical-align: top;"
            }, {
                "destin": ".o_chat-container br + span + br",
                "styles": "display: none;"
            }, {
                "destin": ".o_chat-container img",
                "styles": "padding: 3px 0;"
            }
        ],
        "inl": [
            {
                "source": ".o_chat-container",
                "destin": "/^.*?(<span.*?>).+?<\/span>((.*?(<span.*?>).+?<\/span>.*?)|(.+?[^ ]))$/mg",
                "styles": "display: inline-block"
            }
        ]
    },
    "collectedcurios.com": {
        "name": "Jolly Jack\'s Collected Curios",
        "index": "https://collectedcurios.com/",
        "nav": {
            "prev": "#nav > a:nth-of-type(3)",
            "next": "#nav > a:nth-of-type(4)"
        }
    },
    "lackadaisycats.com": {
        "name": "Lackadaisy Cats",
        "index": "https://lackadaisycats.com/",
        "nav": {
            "prev": ".prev > a",
            "next": ".next > a"
        }
    },
    "oglaf.com": {
        "name": "Oglaf",
        "index": "https://www.oglaf.com/",
        "nav": {
            "prev": "a[rel=prev]",
            "next": "a[rel=next"
        },
        "alt": [{
            "comic": "img#strip",
            "style": "text-align: center; margin: 1em 0 2em; text-decoration: none !important; font-size: 1.2em;"
        }]
    },
    "hs.hiveswap.com": {
        "name": "Paradox Space",
        "index": "http://hs.hiveswap.com/paradoxspace/index.php",
        "nav": {
            "prev": "div.comnavPrev",
            "next": "div.comnavNext"
        }
    },
    "poorlydrawnlines.com": {
        "name": "Poorly Drawn Lines",
        "index": "https://poorlydrawnlines.com/",
        "nav": {
            "prev": "a[rel=prev]",
            "next": "a[rel=next]"
        }
    },
    "prequeladventure.com": {
        "name": "Prequel",
        "index": "https://www.prequeladventure.com/",
        "nav": {
            "prev": ".previous > a[rel=prev]",
            "next": ".next > a[rel=next]"
        }
    },
    "romanticallyapocalyptic.com": {
        "name": "Romantically Apocalyptic",
        "index": "https://romanticallyapocalyptic.com/",
        "nav": {
            "prev": "a[accesskey=p]",
            "next": "a[accesskey=n]"
        }
    },
    "samandfuzzy.com": {
        "name": "Sam & Fuzzy",
        "index": "https://www.samandfuzzy.com/",
        "nav": {
            "prev": ".prev-page > a",
            "next": ".next-page > a"
        }
    },
    "smbc-comics.com": {
        "name": "Saturday Morning Breakfast Cereal",
        "index": "https://www.smbc-comics.com/",
        "alt": [{
            "comic": "#cc-comic",
            "after": "#aftercomic img",
            "ignore": ["[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]"],
            "style": "text-align: center; margin: 1em 0 .2em; text-decoration: none !important; font-size: 1.2em; color: black; display: inline-block;"
        }]
    },
    "threewordphrase.com": {
        "name": "Three Word Phrase",
        "index": "http://threewordphrase.com/",
        "nav": {
            "prev": "img[src=\"/prevlink.gif\"]",
            "next": "img[src=\"/nextlink.gif\"]"
        }
    },
    "what-if.xkcd.com": {
        "name": "What If?",
        "index": "https://what-if.xkcd.com/",
        "nav": {
            "prev": ".nav-prev > a",
            "next": ".nav-next > a"
        },
        "alt": [{
            "comic": "img.illustration",
            "style": "text-align: center; margin: 0 auto; text-decoration: none !important; font-style: oblique; line-height: 1.2em; font-size: 16px;"
        }],
        "exp": [{
            "source": ".refbody",
            "destin": ".refnum",
            "prefix": " [",
            "suffix": "] ",
            "style": "bottom: 0; text-decoration: none; cursor: default; font-size: .75em;"
        }]
    },
    "wildelifecomic.com": {
        "name": "Wilde Life",
        "index": "https://www.wildelifecomic.com/",
        "nav": {
            "prev": "a.cc-prev",
            "next": "a.cc-next"
        },
        "alt": [{
            "comic": "#cc-comicbody img",
            "ignore": ["[0-9]+"],
            "style": "text-align: center; background: rgba(255,255,255,.8); margin: 0;padding: 12px;"
        }]
    },
    "xkcd.com": {
        "name": "xkcd",
        "index": "https://xkcd.com/",
        "nav": {
            "prev":  ".comicNav a[rel=prev]",
            "next":  ".comicNav a[rel=next]"
        },
        "alt": [{
            "comic": "#comic img",
            "style": "text-align: center; margin: 7px auto 30px; text-decoration: none !important;"
        }]
    }
}

const siteList = {}
for (const [key, value] of Object.entries(siteRules)) {
    siteList[value.name] = value.index
}


// set up on install
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        globalEnabled: true,
        globalNextCombo: ['right'],
        globalPrevCombo: ['left'],
        globalStaticCaptions: true,
        globalKeyboardNav: true,
        globalCustomStyles: true,
        globalTextboxExpansion: true,
	}, function() {
        console.log('Initialized sync storage')
    })
})


// set up popup conditions
let conditions = []
for (let site in siteRules) {
    conditions.push(
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostSuffix: site},
        })
    )
}
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: conditions,
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }])
}.bind(conditions))


// add message listeners
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request === 'siteList') {
            sendResponse(siteList)
            return
        }

        if (request.domain in siteRules) {
            let domain = request.domain
            let siteData = siteRules[domain]

            let globalDefaults = {
                globalEnabled: true,
                globalNextCombo: ['right'],
                globalPrevCombo: ['left'],
                globalKeyboardNav: true,
                globalStaticCaptions: true,
                globalTextboxExpansion: true,
                globalCustomStyles: true,
                globalAutoSaveProgress: true }
            let siteDefaults = {
                ['siteKeyboardNav_' + domain]: true,
                ['siteStaticCaptions_' + domain]: true,
                ['siteTextboxExpansion_' + domain]: true,
                ['siteCustomStyles_' + domain]: true,
                ['siteAutoSaveProgress_' + domain]: true,
                ['siteProgressAutoSaved_' + domain]: request.path }
            let defaults = { ...globalDefaults, ...siteDefaults }

            chrome.storage.sync.get(defaults, function(items) {
                let autoSavedKey = 'siteProgressAutoSaved_' + domain
                let autoSavedUrl = items[autoSavedKey]
                delete items[autoSavedKey]

                if (items['globalEnabled']
                    && items['globalAutoSaveProgress']
                    && items['siteAutoSaveProgress_' + domain]
                    && request.path !== (new URL(siteData.index).pathname)) {
                    // we don't care that we're saving the auto-saved progress after retrieval because:
                    // a) retrieving only matters when accessing the index
                    // b) setting only occurs when accessing a non-index
                    chrome.storage.sync.set({
                        ['siteProgressAutoSaved_' + domain]: request.path
                    }, function() {})
                }

                let response = {
                    siteData: siteData,
                    config: items,
                    domain: domain,
                    autoSavedUrl: autoSavedUrl
                }
                sendResponse(response)
            })
            // return true so response can be sent asyncronously
            return true
        }
    }.bind(siteRules)
)


// add tab state change listener since single-page apps are very difficult to listen to from within the content script
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        // check if url changed
        if (changeInfo.url) {
            chrome.tabs.sendMessage(tabId, 'urlchanged')
        }
    }
)


// add storage listener to reload sites on change
chrome.storage.onChanged.addListener(function(changes, namespace) {
    let reloadAll = false
    let reloadSite = false
    let patterns = []

    for (let key in changes) {
        if (changes[key].oldValue === changes[key].newValue
            // exclude progress saves from auto-reload
            || key.startsWith('siteProgressAutoSaved')
            || key.startsWith('siteProgressManualSaved')
        ) {
            continue
        }

        // if a global setting
        if (key.startsWith('global')) {
            reloadAll = true
            for (let domain in siteRules) {
                let pattern = '*://*.' + domain + '/*'
                patterns.push(pattern)
            }
            break

        // if a site-specific setting
        } else if (key.startsWith('site')) {
            reloadSite = true
            let domain = key.split('_').slice(-1)
            let pattern = '*://*.' + domain + '/*'
            patterns.push(pattern)
        }
    }

    // need to explicitly use a conditional here, otherwise all tabs will be returned on query, causing a reload storm if multiple webcomic tabs are open
    if (patterns.length > 0) {
        // url can be a list of strings
        chrome.tabs.query({ url: patterns }, function(tabs) {
            // reload tabs (no batch command, need to do it one-by-one)
            for (let i in tabs) {
                let tab = tabs[i]
                chrome.tabs.reload(tab.id)
            }
        })
    }
}.bind(siteRules))
