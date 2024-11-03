# Flare UI

**Flare UI** is a web based **widget toolkit** using
[custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

This toolkit adds additional HTML elements, such as <flare-dropdown> or <flare-group-box>.

## Browser compatibility

This widget toolkit is designed to be used in [Electron](https://www.electronjs.org/),
which is Chrome-based. This should make browsers based on that engine compatible,
including Microsoft Edge and Opera.

Other browsers are probably not or only partly supported.

## Getting started

In order to get **Flare UI** running, you only need a single JavaScript file
that provides the custom elements. You can get it in various ways:

- Download the latest release from GitHub
- Install via npm: `npm install flare-ui`
- Install via yarn: `yarn add flare-ui`
- Clone the repo with `git clone https://github.com/tenry92/flare-ui.git`,
  run `npm install` (or `yarn`) and `npm run build` (or `yarn build`)

Now you can link the script and theme files in your HTML and start writing your
web application:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Welcome Flare UI</title>
    <script src="dist/flare-ui.js" type="module"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

In the docs you will find a list of each available widget and their options.

## License

Flare UI is licensed under the MIT License.
