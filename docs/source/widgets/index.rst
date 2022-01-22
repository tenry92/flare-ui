Widgets
=======

This toolkit provides numerious widgets (also known as components). Each one may
define several properties, events and more, that are documented here for each
available widget.

Attributes
  HTML attributes you specify within the HTML.
  They are either boolean (e.g. ``primary``) or associated with a string
  value (e.g. ``value="42"``).
  The allowed values might be restricted in some cases, e.g. non-numeric
  values might be ignored.

Properties
  These are the JavaScript properties that can be read from and sometimes
  written to the elements. Example: ``button.primary = true;``

Events
  The custom JavaScript events that can be dispatched by the elements.
  Use `addEventListener() <https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener>`_
  for adding event listeners, just like you do with any other regular HTML element.

CSS properties
  Custom styling properties that can be set via CSS.
  These are always prefixed with two dashes.

Parts
  Sub-elements of a custom element that can be styled individually.
  These can be selected using the ``::part(name)`` selector.
  See :doc:`/styling/parts` for more details.

Pseudo classes
  Custom states that a custom element may have.
  These are always prefixed with two dashes.
  See :doc:`/styling/pseudo-classes` for more details.

.. toctree::
  :maxdepth: 1
  :glob:
  :caption: Available Widgets

  generated/*
