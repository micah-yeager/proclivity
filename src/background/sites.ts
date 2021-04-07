import { WebcomicHosts } from '@src/types'

export const siteRules: WebcomicHosts = {
  'asofterworld.com': {
    '/': {
      name: 'A Softer World',
      indexUrl: 'https://asofterworld.com/',
      navigation: {
        previousSelector: '#previous a',
        nextSelector: '#next a',
      },
      captions: [
        {
          comicSelector: '#comicimg img',
          styleProperties: 'text-align: center;',
        },
      ],
      autoSave: {
        allowedPattern: /index\.php\?id=[0-9]{1,4}/g,
      },
      styles: [
        {
          selector: '#insidebodycomic',
          properties: 'height: auto;',
        },
      ],
    },
  },
  'beefpaper.com': {
    '/': {
      name: 'Beefpaper',
      indexUrl: 'http://beefpaper.com/',
      navigation: {
        previousSelector: '.comic-nav-previous',
        nextSelector: '.comic-nav-next',
      },
      captions: [
        {
          comicSelector: '#comic img',
          styleProperties: 'color: black;',
        },
      ],
      autoSave: {
        allowedPattern: /comic\/.*\//g,
      },
    },
  },
  'bunny-comic.com': {
    '/': {
      name: 'Bunny',
      indexUrl: 'http://www.bunny-comic.com/',
      navigation: {
        previousSelector: '#navigator a:nth-child(2)',
        nextSelector: '#navigator a:nth-child(3)',
      },
      captions: [
        {
          comicSelector: '#strip a:nth-child(2) img',
          destination: {
            selector: '#strip > .comic',
            insertionMethod: 'before',
          },
          styleProperties: 'padding-bottom: 0; margin-bottom: -20px;',
        },
      ],
      autoSave: {
        allowedPattern: /[0-9]+\.html/g,
      },
    },
  },
  'buttercupfestival.com': {
    '/': {
      name: 'Buttercup Festival',
      indexUrl: 'http://www.buttercupfestival.com/',
      navigation: {
        previousSelector: 'center > * > a:nth-last-child(3)',
        nextSelector: 'center > * > a:nth-last-child(2)',
      },
      autoSave: {
        additionalIndices: ['/index.htm'],
        allowedPattern: /[0-9]-[0-9]+\.htm/g,
      },
    },
  },
  'buttersafe.com': {
    '/': {
      name: 'Buttersafe',
      indexUrl: 'https://www.buttersafe.com/',
      navigation: {
        previousSelector: 'a[rel=prev]',
        nextSelector: 'a[rel=next]',
      },
      autoSave: {
        allowedPattern: /[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+/g,
      },
    },
  },
  'collectedcurios.com': {
    '/sequentialart.php': {
      name: 'Sequential Art',
      indexUrl: 'https://collectedcurios.com/sequentialart.php',
      navigation: {
        previousSelector: '#nav > a:nth-of-type(3)',
        nextSelector: '#nav > a:nth-of-type(4)',
      },
      autoSave: {
        allowedPattern: /\?s=[0-9]+/g,
      },
    },
    '/battlebunnies.php': {
      skipIndex: true,
      name: 'Battle Bunnies',
      indexUrl: 'https://collectedcurios.com/battlebunnies.php',
      navigation: {
        previousSelector: '#nav > a:nth-of-type(3)',
        nextSelector: '#nav > a:nth-of-type(4)',
      },
      autoSave: {
        allowedPattern: /\?s=[0-9]+/g,
      },
    },
    '/spiderandscorpion.php': {
      skipIndex: true,
      name: 'Spider & Scorpion',
      indexUrl: 'https://collectedcurios.com/spiderandscorpion.php',
      navigation: {
        previousSelector: '#nav > a:nth-of-type(3)',
        nextSelector: '#nav > a:nth-of-type(4)',
      },
      autoSave: {
        allowedPattern: /\?s=[0-9]+/g,
      },
    },
  },
  'daisyowl.com': {
    '/': {
      name: 'Daisy Owl',
      indexUrl: 'https://daisyowl.com/',
      navigation: {
        previousSelector: '.nav > *:first-child',
        nextSelector: '.nav > *:last-child',
      },
      captions: [
        {
          comicSelector: '.main img',
          styleProperties:
            'text-align: center; padding: 7px; margin: 0 0 20px; font-size: 1.2em; margin-top: -2em;',
        },
      ],
      autoSave: {
        allowedPattern: /comic\/[0-9]{4}-[0-9]{2}-[0-9]{2}\/?/g,
      },
    },
  },
  'dieselsweeties.com': {
    '/archive': {
      skipIndex: true,
      name: 'diesel sweeties (archive)',
      indexUrl: 'https://www.dieselsweeties.com/',
      navigation: {
        nextSelector: 'a[title="read the next webcomic"]',
        previousSelector: 'a[title="read the previous webcomic"]',
      },
      autoSave: {
        allowedPattern: /\/[0-9]+/g,
      },
    },
    '/': {
      name: 'diesel sweeties',
      indexUrl: 'https://www.dieselsweeties.com/',
      navigation: {
        nextSelector: '#wrapmore a:first-child',
        previousSelector: '#wrapmore a:nth-child(3)',
      },
      autoSave: {
        allowedPattern: /ics\/[0-9]+\//g,
      },
    },
  },
  'qwantz.com': {
    '/': {
      name: 'Dinosaur Comics',
      indexUrl: 'https://qwantz.com/',
      navigation: {
        previousSelector: 'a[rel=prev]',
        nextSelector: 'a[rel=next]',
      },
      captions: [
        {
          comicSelector: 'img.comic',
          styleProperties:
            'text-align: center; background: rgba(255,255,255,.8); padding: 7px; margin: 7px 0;',
        },
      ],
      autoSave: {
        allowedPattern: /index\.php\?comic=[0-9]+/g,
      },
    },
  },
  'doodleforfood.com': {
    '/': {
      name: 'Doodle for Food',
      indexUrl: 'https://www.doodleforfood.com/',
      navigation: {
        previousSelector: 'a.previous-button',
        nextSelector: 'a.next-button',
      },
      autoSave: {
        allowedPattern: /page\/[0-9]+\/?/g,
      },
    },
  },
  'drmcninja.com': {
    '/': {
      name: 'Dr. McNinja',
      indexUrl: 'http://drmcninja.com/',
      navigation: {
        previousSelector: '.prepostnav > a.prev',
        nextSelector: '.prepostnav > a.next',
      },
      captions: [
        {
          comicSelector: '#comic > img',
          ignoredPatterns: ['[0-9]+?p[0-9]+'],
          styleProperties:
            'text-align: center; margin: 1em 0 2em; text-decoration: none !important; font-size: 1.2em;',
        },
      ],
      autoSave: {
        allowedPattern: /archives\/comic\/[0-9]{1,2}p[0-9]{1,3}\//g,
      },
    },
  },
  'dresdencodak.com': {
    '/': {
      name: 'Dresden Codak',
      indexUrl: 'https://dresdencodak.com/',
      navigation: {
        previousSelector: 'img[alt="Previous"]',
        nextSelector: 'img[alt="Next Page"]',
      },
      autoSave: {
        allowedPattern: /[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+/g,
      },
    },
  },
  'dumbingofage.com': {
    '/': {
      name: 'Dumbing of Age',
      indexUrl: 'https://www.dumbingofage.com/',
      navigation: {
        previousSelector: '.navi-prev',
        nextSelector: '.navi-next',
      },
      captions: [
        {
          comicSelector: '#comic .comicpane img',
          styleProperties: 'margin-bottom: 20px',
        },
      ],
      autoSave: {
        allowedPattern: /[0-9]{4}\/comic\/book-[0-9]{1,2}\/.*\//g,
      },
    },
  },
  'gunnerkrigg.com': {
    '/': {
      name: 'Gunnerkrigg Court',
      indexUrl: 'https://www.gunnerkrigg.com/',
      navigation: {
        previousSelector: '.extra > .nav > a.left',
        nextSelector: '.extra > .nav > a.right',
      },
      autoSave: {
        allowedPattern: /\?p=[0-9]+/g,
      },
    },
  },
  'harkavagrant.com': {
    '/': {
      name: 'Hark! A Vagrant',
      indexUrl: 'http://www.harkavagrant.com/',
      navigation: {
        levelsAboveSelector: 1,
        previousSelector: 'a > img[src="buttonprevious.png"]',
        nextSelector: 'a > img[src="buttonnext.png"]',
      },
      autoSave: {
        allowedPattern: /index\.php\?id=[0-9]+/g,
      },
    },
  },
  'homestuck.com': {
    '/problem-sleuth': {
      name: 'Problem Sleuth',
      indexUrl: 'https://www.homestuck.com/problem-sleuth',
      navigation: {
        previousSelector:
          '.o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a',
        nextSelector: '.o_story-nav > div:last-of-type a',
      },
      autoSave: {
        allowedPattern: /\/[0-9]+/g,
      },
    },
    '/jailbreak': {
      skipIndex: true,
      name: 'Jailbreak',
      indexUrl: 'https://www.homestuck.com/jailbreak',
      navigation: {
        previousSelector:
          '.o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a',
        nextSelector: '.o_story-nav > div:last-of-type a',
      },
      autoSave: {
        allowedPattern: /\/[0-9]+/g,
      },
    },
    '/epilogues': {
      skipIndex: true,
      name: 'Homestuck Epilogues',
      indexUrl: 'https://www.homestuck.com/epilogues',
      navigation: {
        previousSelector:
          '.o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a',
        nextSelector: '.o_story-nav > div:last-of-type a',
      },
      autoSave: {
        allowedPattern: /\/(prologue|meat|candy)\/[0-9]+/g,
      },
    },
    '/sweet-bro-and-hella-jeff': {
      skipIndex: true,
      name: 'Sweet Bro and Hella Jeff',
      indexUrl: 'https://www.homestuck.com/sweet-bro-and-hella-jeff',
      navigation: {
        levelsAboveSelector: 1,
        previousSelector: 'img[src="/storydata/sweet/back.jpg"]',
        nextSelector: 'img[src="/storydata/sweet/next.jpg"]',
      },
      autoSave: {
        allowedPattern: /\/[0-9]{1,2}/g,
      },
    },
    '/': {
      name: 'Homestuck',
      indexUrl: 'https://www.homestuck.com/',
      navigation: {
        previousSelector:
          '.o_game-nav:first-of-type .o_game-nav-item:nth-of-type(2) a',
        nextSelector: '.o_story-nav > div:last-of-type a',
      },
      captions: [
        {
          comicSelector: 'body > div > img',
          styleProperties: 'text-align: center; margin: .4em 0 .8em;',
        },
      ],
      expansions: [
        {
          sourceSelector: '.o_chat-log',
          destination: {
            selector: '.o_chat-container',
            insertionMethod: 'replace',
          },
          styleProperties:
            'display: block; line-height: 1.35; font-size: 14px; text-align: left; padding: 16px 32.5px',
        },
        {
          sourceSelector: '.o_chat-log span a',
          destination: {
            selector: '.o_chat-log span a',
            insertionMethod: 'replace',
          },
          prefix: '<img src="',
          suffix: '" />',
          styleProperties: 'display: inline-block; text-indent: 0;',
          isLink: true,
        },
      ],
      styles: [
        {
          selector: '.o_chat-container span[style*="color: #FFFFFF"]',
          properties: 'background-color: #000;',
        },
        {
          selector: '.o_chat-container br + span',
          properties: 'display: block; padding-left: 34px; text-indent: -34px;',
        },
        {
          selector: '.o_chat-container span, .o_chat-container span *',
          properties: 'vertical-align: top;',
        },
        {
          selector: '.o_chat-container br + span + br',
          properties: 'display: none;',
        },
        {
          selector: '.o_chat-container img',
          properties: 'padding: 3px 0;',
        },
        {
          selector: '#desktop_skyscraper',
          properties:
            'z-index: unset !important; background-color: #C6C6C6 !important;',
        },
      ],
      autoSave: {
        additionalIndices: ['/story'],
        allowedPattern: /(story\/)?[0-9]+(\/[0-9])?/g,
      },
    },
  },
  'johnnywander.com': {
    '/barbarous': {
      skipIndex: true,
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/barbarous',
      navigation: {
        previousSelector: 'a.cc-prev',
        nextSelector: 'a.cc-next',
      },
      autoSave: {
        allowedPattern: /\/.+\/?/g,
      },
    },
    '/luckypenny': {
      skipIndex: true,
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/luckypenny',
      navigation: {
        previousSelector: 'a.cc-prev',
        nextSelector: 'a.cc-next',
      },
      autoSave: {
        allowedPattern: /\/.+\/?/g,
      },
    },
    '/autobio': {
      skipIndex: true,
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/autobio',
      navigation: {
        previousSelector: 'a.cc-prev',
        nextSelector: 'a.cc-next',
      },
      autoSave: {
        allowedPattern: /\/.+\/?/g,
      },
    },
    '/fiction': {
      skipIndex: true,
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/fiction',
      navigation: {
        previousSelector: 'a.cc-prev',
        nextSelector: 'a.cc-next',
      },
      autoSave: {
        allowedPattern: /\/.+\/?/g,
      },
    },
    '/': {
      name: 'Johnny Wander',
      indexUrl: 'http://www.johnnywander.com/',
      navigation: {
        previousSelector: 'a.cc-prev',
        nextSelector: 'a.cc-next',
      },
      autoSave: {
        allowedPattern: /comic\/.+\/?/g,
      },
    },
  },
  'jspowerhour.com': {
    '/': {
      name: 'Junior Scientist Power Hour',
      indexUrl: 'https://www.jspowerhour.com/',
      navigation: {
        previousSelector: 'a[aria-label="previous"]',
        nextSelector: 'a[aria-label="next"]',
      },
      autoSave: {
        allowedPattern: /comics\/[0-9]+\/?/g,
      },
    },
  },
  'lackadaisycats.com': {
    '/comic.php': {
      name: 'Lackadaisy Cats',
      indexUrl: 'https://lackadaisycats.com/comic.php',
      navigation: {
        previousSelector: '.prev > a',
        nextSelector: '.next > a',
      },
      autoSave: {
        allowedPattern: /\?comicid=[0-9]+/g,
      },
    },
  },
  'oglaf.com': {
    '/': {
      name: 'Oglaf [NSFW]',
      nsfw: true,
      skipIndex: true,
      indexUrl: 'https://www.oglaf.com/',
      navigation: {
        previousSelector: 'a[rel=prev]',
        nextSelector: 'a[rel=next',
      },
      captions: [
        {
          comicSelector: 'img#strip',
          destination: {
            selector: '.content',
            insertionMethod: 'appendChild',
          },
          wrapperStyleProperties:
            'padding: 597px 160px 16px 16px; background-color: #ccc; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;',
          styleProperties:
            'text-align: center; margin-bottom: 0; text-decoration: none !important; font-size: 1em;',
        },
      ],
      styles: [
        {
          selector: '.align.btm',
          properties: 'display: none;',
        },
      ],
      autoSave: {
        allowedPattern: /.+/g,
        ignoredPattern: /archive\//g,
      },
    },
  },
  'hs.hiveswap.com': {
    '/paradoxspace/index.php': {
      skipIndex: true,
      name: 'Paradox Space',
      indexUrl: 'http://hs.hiveswap.com/paradoxspace/index.php',
      navigation: {
        previousSelector: 'div.comnavPrev',
        nextSelector: 'div.comnavNext',
      },
      autoSave: {
        allowedPattern: /\?comic=[0-9]+/g,
      },
    },
  },
  'poorlydrawnlines.com': {
    '/': {
      name: 'Poorly Drawn Lines',
      indexUrl: 'https://poorlydrawnlines.com/',
      navigation: {
        previousSelector: 'a[rel=prev]',
        nextSelector: 'a[rel=next]',
      },
      autoSave: {
        allowedPattern: /comic\/.+/g,
      },
    },
  },
  'prequeladventure.com': {
    '/': {
      name: 'Prequel',
      indexUrl: 'https://www.prequeladventure.com/',
      navigation: {
        previousSelector: '.previous > a[rel=prev]',
        nextSelector: '.next > a[rel=next]',
      },
      autoSave: {
        allowedPattern: /[0-9]{4}\/[0-9]{2}\/.+\//g,
      },
    },
  },
  'pbfcomics.com': {
    '/': {
      name: 'The Perry Bible Fellowship',
      indexUrl: 'https://pbfcomics.com/',
      navigation: {
        previousSelector: 'a[rel="prev"]',
        nextSelector: 'a[rel="next"]',
      },
      styles: [
        {
          selector: '#main-header',
          properties: 'z-index: unset;',
        },
      ],
      autoSave: {
        allowedPattern: /comics\/.+?\//g,
      },
    },
  },
  'questionablecontent.net': {
    '/': {
      name: 'Questionable Content',
      indexUrl: 'https://www.questionablecontent.net/',
      navigation: {
        previousSelector: '#comicnav li:nth-child(2) a',
        nextSelector: '#comicnav li:nth-child(3) a',
      },
      autoSave: {
        allowedPattern: /view\.php\?comic=[0-9]+/g,
      },
    },
  },
  'romanticallyapocalyptic.com': {
    '/': {
      name: 'Romantically Apocalyptic',
      indexUrl: 'https://romanticallyapocalyptic.com/',
      navigation: {
        previousSelector: 'a[accesskey=p]',
        nextSelector: 'a[accesskey=n]',
      },
      autoSave: {
        allowedPattern: /.+/g,
        ignoredPattern: /(info|wiki|archives|store|forums|gallery|links|contact|login|join).+/g,
      },
    },
  },
  'samandfuzzy.com': {
    '/': {
      name: 'Sam & Fuzzy',
      indexUrl: 'https://www.samandfuzzy.com/',
      navigation: {
        previousSelector: '.prev-page > a',
        nextSelector: '.next-page > a',
      },
      autoSave: {
        allowedPattern: /[0-9]+\/?/g,
      },
    },
  },
  'smbc-comics.com': {
    '/': {
      name: 'Saturday Morning Breakfast Cereal',
      indexUrl: 'https://www.smbc-comics.com/',
      navigation: {
        previousSelector: '.cc-nav .cc-prev',
        nextSelector: '.cc-nav .cc-next',
      },
      captions: [
        {
          comicSelector: '#cc-comic',
          afterComicSelector: '#aftercomic img',
          ignoredPatterns: ['[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'],
          styleProperties:
            'text-align: center; margin: 1em 0 .2em; text-decoration: none !important; font-size: 1.2em; color: black; display: inline-block;',
        },
      ],
      autoSave: {
        allowedPattern: /comic\/.+\/?/g,
      },
    },
  },
  'amultiverse.com': {
    '/': {
      name: 'Scenes from a Multiverse',
      indexUrl: 'https://amultiverse.com/',
      captions: [
        {
          comicSelector: '#comic img',
          styleProperties: 'margin-top: 20px',
        },
      ],
      navigation: {
        previousSelector: 'a.comic-nav-previous',
        nextSelector: 'a.comic-nav-next',
      },
      autoSave: {
        allowedPattern: /comic\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+\//g,
      },
    },
  },
  'somethingpositive.net': {
    '/': {
      name: 'Something Positive',
      indexUrl: 'https://somethingpositive.net/',
      navigation: {
        previousSelector:
          'body > table tr table tr table table tr table td:nth-child(3) a',
        nextSelector:
          'body > table tr table tr table table tr table td:nth-child(5) a',
      },
      autoSave: {
        allowedPattern: /comic\/.+\//g,
      },
    },
  },
  'threewordphrase.com': {
    '/': {
      name: 'Three Word Phrase',
      indexUrl: 'http://threewordphrase.com/',
      navigation: {
        previousSelector: 'img[src="/prevlink.gif"]',
        nextSelector: 'img[src="/nextlink.gif"]',
      },
      autoSave: {
        allowedPattern: /.+/g,
        ignoredPattern: /(archive|index).htm/g,
      },
    },
  },
  'what-if.xkcd.com': {
    '/': {
      name: 'What If?',
      indexUrl: 'https://what-if.xkcd.com/',
      navigation: {
        previousSelector: '.nav-prev > a',
        nextSelector: '.nav-next > a',
      },
      captions: [
        {
          comicSelector: 'img.illustration',
          styleProperties:
            'text-align: center; margin: 0 auto; text-decoration: none !important; font-style: oblique; line-height: 1.2em; font-size: 16px;',
        },
      ],
      expansions: [
        {
          sourceSelector: '.refbody',
          destination: { selector: '.refnum', insertionMethod: 'replace' },
          prefix: ' [',
          suffix: '] ',
          styleProperties:
            'bottom: 0; text-decoration: none; cursor: default; font-size: .75em;',
        },
      ],
      autoSave: {
        allowedPattern: /[0-9]+\//g,
      },
    },
  },
  'wildelifecomic.com': {
    '/': {
      name: 'Wilde Life',
      indexUrl: 'https://www.wildelifecomic.com/',
      navigation: {
        previousSelector: 'a.cc-prev',
        nextSelector: 'a.cc-next',
      },
      captions: [
        {
          comicSelector: '#cc-comicbody img',
          ignoredPatterns: ['[0-9]+'],
          styleProperties:
            'text-align: center; background: rgba(255,255,255,.8); margin: 0;padding: 12px;',
        },
      ],
      autoSave: {
        allowedPattern: /comic\/[0-9]+/g,
      },
    },
  },
  'wondermark.com': {
    '/': {
      name: 'Wondermark',
      indexUrl: 'https://wondermark.com/',
      navigation: {
        previousSelector: '.comic-nav-previous a',
        nextSelector: '.comic-nav-next a',
      },
      captions: [
        {
          comicSelector: '#comic img',
          styleProperties: 'margin-bottom: 5px;',
        },
      ],
      autoSave: {
        allowedPattern: /c?[0-9]+\/?/g,
      },
    },
  },
  'xkcd.com': {
    '/': {
      name: 'xkcd',
      indexUrl: 'https://xkcd.com/',
      navigation: {
        previousSelector: '.comicNav a[rel=prev]',
        nextSelector: '.comicNav a[rel=next]',
      },
      captions: [
        {
          comicSelector: '#comic img',
          styleProperties:
            'text-align: center; margin: 7px auto 30px; text-decoration: none !important;',
        },
      ],
      autoSave: {
        allowedPattern: /[0-9]+\//g,
      },
    },
  },
}
