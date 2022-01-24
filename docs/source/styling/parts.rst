Parts
=====

Many widgets are built upon stylable sub-elements. For example:

* the :doc:`/widgets/generated/number-input` is composed by a :doc:`/widgets/generated/text-input` and :doc:`/widgets/generated/stepper` element
* the :doc:`/widgets/generated/checkbox` is composed by the actual checkbox, the checkmark and the label

Each part, a custom element exposes, has one or multiple names and can be selected
in CSS with the ``::part(name)`` selector. For example, in order to style the
label of a checkbox, use a CSS like this:

.. code-block:: css

  flare-checkbox::part(label) {
    color: red;
  }

Check the documentation of each individual widget to see which parts are exported.
