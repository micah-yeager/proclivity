# Proclivity

A browser plugin that assists with reading webcomics by improving accessibility — focused especially on archival readings through webcomics.

## Features

- Save and load your progress automatically with support for setting manual checkpoints
- Add consistent, customizable keyboard navigation with support for Gmail-style key sequences
- Copy comic title text to a static image caption below the comic (e.g. [xkcd](https://xkcd.com))
- Copy any after-comics to below the comic (e.g. [Saturday Morning Breakfast Cereal](https://smbc-comics.com))
- Expand textboxes in-place (e.g. [What If?](https://what-if.xkcd.com), [Homestuck](https://homestuck.com))

## Get started

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