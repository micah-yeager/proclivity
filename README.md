# Proclivity

A browser plugin that assists with reading webcomics by improving accessibility — focused especially on archival readings through webcomics.

## Overview

### Features

- Save and load your progress automatically with support for setting manual checkpoints
- Add consistent, customizable keyboard navigation with support for Gmail-style key sequences
- Copy comic title text to a static image caption below the comic (e.g. [xkcd](https://xkcd.com))
- Copy any after-comics to below the comic (e.g. [Saturday Morning Breakfast Cereal](https://smbc-comics.com))
- Expand textboxes in-place (e.g. [What If?](https://what-if.xkcd.com), [Homestuck](https://homestuck.com))

### Supported webcomics

Issues or pull requests for additional sites are welcome!

- [Beefpaper](http://beefpaper.com/)
- [Buttersafe](https://www.buttersafe.com/)
- [Bunny](http://www.bunny-comic.com/)
- [Daisy Owl](https://daisyowl.com/)
- [Dinosaur Comics](https://qwantz.com/)
- [Dr. McNinja](http://drmcninja.com/)
- [Dresden Codak](https://dresdencodak.com/)
- [Dumbing of Age](https://www.dumbingofage.com/)
- [Gunnerkrigg Court](https://www.gunnerkrigg.com/)
- [Hark! A Vagrant](http://www.harkavagrant.com/)
- [Homestuck](https://www.homestuck.com/)
- [Jolly Jack's Collected Curios](https://collectedcurios.com/)
- [Lackadaisy Cats](https://lackadaisycats.com/)
- [Oglaf](https://www.oglaf.com/) (NSFW)
- [Paradox Space](http://hs.hiveswap.com/paradoxspace/index.php)
- [Poorly Drawn Lines](https://poorlydrawnlines.com/)
- [Prequel](https://www.prequeladventure.com/)
- [Questionable Content](https://www.questionablecontent.net/)
- [Romantically Apocalyptic](https://romanticallyapocalyptic.com/)
- [Sam & Fuzzy](https://www.samandfuzzy.com/)
- [Saturday Morning Breakfast Cereal](https://www.smbc-comics.com/)
- [Three Word Phrase](http://threewordphrase.com/)
- [What If?](https://what-if.xkcd.com/)
- [Wilde Life](https://www.wildelifecomic.com/)
- [xkcd](https://xkcd.com/)

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

Open the [Extensions Dashboard](chrome://extensions), enable "Developer mode", click "Load unpacked", and choose the `dist` folder.

### Production

When it's time to publish your Chrome make a production build. Run the following line:

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