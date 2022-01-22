# Jae UI

**Jae UI** is a web based **widget toolkit** using
[custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

This toolkit adds additional HTML elements, such as <jae-dropdown> or <jae-group-box>.

## Browser compatibility

This widget toolkit is designed to be used in [Electron](https://www.electronjs.org/),
which is Chrome-based. This should make browsers based on that engine compatible,
including Microsoft Edge and Opera.

Other browsers are probably not or only partly supported.

## Getting started

In order to get **Jae UI** running, you need the JavaScript that provides the
custom elements (this repository) and any compatible CSS theme that is made for
styling `jae-*` elements.

For the script, you only need a single **jae-ui.js** file, which you can get in
various ways:

- Download the latest release from GitHub
- Install via npm: `npm install jae-ui`
- Install via yarn: `yarn add jae-ui`
- Clone the repo with `git clone https://github.com/tenry92/jae-ui.git`,
  run `npm install` (or `yarn`) and `npm run build` (or `yarn build`)

For the CSS theme, there is currently only one available.

Now you can link the script and theme files in your HTML and start writing your
web application:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Welcome Jae UI</title>
    <script src="dist/jae-ui.js" type="module"></script>
    <link rel="stylesheet" href="themes/jae/jae.css">
  </head>
  <body>
    ...
  </body>
</html>
```

In the docs you will find a list of each available widget and their options.

## License

Jae UI is licensed under the MIT License.
