# Proclivity

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/micah-yeager/proclivity/Build%20and%20test)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/micah-yeager/proclivity/Create%20release?label=release)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/micah-yeager/proclivity)

![Maintenance](https://img.shields.io/maintenance/yes/2021)
![GitHub issues](https://img.shields.io/github/issues/micah-yeager/proclivity)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/micah-yeager/proclivity)
![Code Climate issues](https://img.shields.io/codeclimate/issues/micah-yeager/proclivity?label=codacy%20issues)

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/micah-yeager/proclivity)
![GitHub Release Date](https://img.shields.io/github/release-date/micah-yeager/proclivity)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/micah-yeager/proclivity/main)
![GitHub](https://img.shields.io/github/license/micah-yeager/proclivity)

A browser plugin that assists with reading webcomics by improving accessibility
— focused especially on archival readings through webcomics.

Available for:
- Chrome (pending webstore approval)
- Edge (pending webstore approval)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/proclivity/)
- Opera (pending webstore approval)

## Overview

### Features

- Save and load your progress automatically with support for setting manual
  checkpoints
- Add consistent, customizable keyboard navigation with support for Gmail-style
  key sequences
- Copy comic title text to a static image caption below the comic (e.g.
  [xkcd](https://xkcd.com))
- Copy any after-comics to below the comic (e.g.
  [Saturday Morning Breakfast Cereal](https://smbc-comics.com))
- Expand textboxes in-place (e.g. [What If?](https://what-if.xkcd.com),
  [Homestuck](https://homestuck.com))

<details>
  <summary>Click to show supported webcomics. Issues or pull requests for additional sites are welcome!</summary>

  ### Supported webcomics

  - [A Softer World](https://asofterworld.com/)
  - [Beefpaper](http://beefpaper.com/)
  - [Buttercup Festival](http://www.buttercupfestival.com/)
  - [Buttersafe](https://www.buttersafe.com/)
  - [Bunny](http://www.bunny-comic.com/)
  - [Collected Curios](https://collectedcurios.com/)
  - [Daisy Owl](https://daisyowl.com/)
  - [diesel sweeties](https://www.dieselsweeties.com/)
  - [Dinosaur Comics](https://qwantz.com/)
  - [Doodle for Food](https://www.doodleforfood.com/)
  - [Dr. McNinja](http://drmcninja.com/)
  - [Dresden Codak](https://dresdencodak.com/)
  - [Dumbing of Age](https://www.dumbingofage.com/)
  - [Gunnerkrigg Court](https://www.gunnerkrigg.com/)
  - [Hark! A Vagrant](http://www.harkavagrant.com/)
  - [Homestuck](https://www.homestuck.com/)
  - [Johnny Wander](http://www.johnnywander.com/)
  - [Junior Scientist Power Hour](https://www.jspowerhour.com/)
  - [Lackadaisy Cats](https://lackadaisycats.com/)
  - [Oglaf](https://www.oglaf.com/) (NSFW)
  - [Paradox Space](http://hs.hiveswap.com/paradoxspace/index.php)
  - [Poorly Drawn Lines](https://poorlydrawnlines.com/)
  - [Prequel](https://www.prequeladventure.com/)
  - [Questionable Content](https://www.questionablecontent.net/)
  - [Romantically Apocalyptic](https://romanticallyapocalyptic.com/)
  - [Sam & Fuzzy](https://www.samandfuzzy.com/)
  - [Saturday Morning Breakfast Cereal](https://www.smbc-comics.com/)
  - [Scenes from a Multiverse](https://amultiverse.com/)
  - [Something Positive](https://somethingpositive.net/)
  - [The Perry Bible Fellowship](https://pbfcomics.com/)
  - [Three Word Phrase](http://threewordphrase.com/)
  - [What If?](https://what-if.xkcd.com/)
  - [Wilde Life](https://www.wildelifecomic.com/)
  - [Wondermark](http://wondermark.com/)
  - [xkcd](https://xkcd.com/)
</details>

## Building locally

Type this into your terminal:

```sh
git clone https://github.com/micah-yeager/proclivity
npm install
```

### Development

For development with automatic reloading:

```sh
npm run start
```

Open the [Extensions Dashboard](chrome://extensions), enable "Developer mode",
click "Load unpacked", and choose the `dist` folder.

### Production

When it's time to publish your Chrome make a production build. Run the following
line:

```sh
npm run build
```

This will create a ZIP file with your package name and version in the `releases`
folder.

## Support the dev

If you feel so inclined, you can donate using one of the following options:

- [PayPal](https://paypal.me/MicahHummert)
- [Cash App](https://cash.app/$micahyeagers)
- Bitcoin: 39s1W2rJHbrVfN5hpTJUJt8T7EtBhuJr2e
