Getting started
===============

Download
--------

You can get **Flare UI** in multiple ways:

* Download  the latest release from GitHub
* Clone the repo: ``git clone https://github.com/tenry92/flare-ui.git``
* Install with npm: ``npm install flare-ui``
* Install with yarn: ``yarn add flare-ui``

You will also need to download a compatible theme, such as one from the
`flare-ui-themes <https://github.com/tenry92/flare-ui-themes>`_ package.

Setup
-----

Load the **flare-ui.js** script and a **compatible CSS theme**:

.. code-block:: html
  :emphasize-lines: 6-7

  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome Flare UI</title>
      <script src="dist/flare-ui.js" type="module"></script>
      <link rel="stylesheet" href="flare-ui-themes/flat/flat.css">
    </head>
    <body>
      ...
    </body>
  </html>

Now you can fill the body with the custom components.
It's recommended to work with nested :doc:`flare-layout components </widgets/generated/layout>` to build the UI.
