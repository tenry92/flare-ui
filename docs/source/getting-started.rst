Getting started
===============

Download
--------

You can get **Jae UI** in multiple ways:

* Download  the latest release from GitHub
* Clone the repo: ``git clone https://github.com/tenry92/jae-ui.git``
* Install with npm: ``npm install jae-ui``
* Install with yarn: ``yarn add jae-ui``

You will also need to download a compatible theme, such as one from the
`jae-ui-themes <https://github.com/tenry92/jae-ui-themes>`_ package.

Setup
-----

Load the **jae-ui.js** script and a **compatible CSS theme**:

.. code-block:: html
  :emphasize-lines: 6-7

  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome Jae UI</title>
      <script src="dist/jae-ui.js" type="module"></script>
      <link rel="stylesheet" href="jae-ui-themes/flat/flat.css">
    </head>
    <body>
      ...
    </body>
  </html>

Now you can fill the body with the custom components.
It's recommended to work with nested :doc:`jae-layout components </widgets/generated/layout>` to build the UI.
