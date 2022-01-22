Coding style
============

General rules
-------------

* Indent using **2 spaces**
* Use **trailing commas**
* Specify function **return types**
* Specify **member accessibility**
* Use **camelCase** for variables and class members
* Use **PacalCase** for classes

Member ordering
---------------

Use the following order for class members:

#. **Static fields** in alphabetical order
#. **Fields, getters and setters** in alphabetical order
#. **Constructor**
#. **Static methods** in alphabetical order
#. **Methods** in alphabetical order

Mark each region with ``//#region`` and ``//#endregion`` comments. Example:

.. code-block:: ts

  class MyClass {
    //#region Static Fields
    public static field1: string;
    //#endregion

    //#region Fields
    public field2: boolean;

    public get field3(): number {
      return 42;
    }
    //#endregion

    public constructor() {
      // stub
    }

    //#region Static Methods
    public static getSomething(): number {
      return 42;
    }
    //#endregion

    //#region Methods
    public doSomething(): void {
      console.log('something');
    }
    //#endregion
  }
