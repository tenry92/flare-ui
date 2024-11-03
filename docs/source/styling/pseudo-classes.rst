Pseudo-classes
==============

CSS provides many pseudo-classes such as ``:hover`` or ``:active``.
This widget toolkit adds additional pseudo-classes to some of its widgets, such
as ``:state(open)`` or ``:state(pressed)``.

``:state(pressed)`` vs. ``:active``
-----------------------------------

The custom pseudo-class ``:state(pressed)`` is semantically the same as ``:active``.
A regular HTML element will receive the ``:active`` class, when it's currently
being clicked or, as with ``<button>`` for example, pressed using the keyboard
(holding *Space*).

Unfortunately, custom elements will not receive the ``:active`` class when trying
to activate with the keyboard. That's why this toolkit comes with an additional
pseudo-class, which also activates when the focused element received a key press
on the *Space* key.
