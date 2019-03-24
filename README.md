# Weaveworld

**Weaveworld (ῶ)** is an experimental framework for interactive web applications, to provide the theoretically shortest (!) representation for "data-intensive" applications (forms, etc.) using simple HTML and JS techniques, without loss of readability. Only basic (!) HTML/CSS/JavaScript(ES6 or ES5) skills are required to create applications.

**License**: it is _free_ to use, but _**not** open-source_ during its experimental phase (i.e., it is not allowed to use elsewhere parts or modified versions of the source, however the framework is totally customizable and redefinable). Weaveworld is about the one tenth of the Weaveworld-ONCE web framework. Patent pending for the "type-binding" technique. See: [licence](LICENSE).

For comparison, there's a [simplified demo page](demo/todo), which functional equivalent versions are also in Vue, React and Angular.    
In case of full-scale business web applications, the code based on Weaveworld is about 2-4 times smaller and simpler than the usual methods.

Usage (where VERSION: MAJOR.MINOR.DATE; suggested use: MAJOR.MINOR, e.g., .../`Weaveworld@0.10/`...)
```html
  <script src="https://cdn.jsdelivr.net/gh/weaveworld/Weaveworld@VERSION/w.min.js"></script>
  <link href="https://cdn.jsdelivr.net/gh/weaveworld/Weaveworld@VERSION/w.css" rel="stylesheet"/>
```

**Using** Weaveworld is extremely simple. (see: [A simple example to do list](demo/simple-todo) tutorial.)
* Create an HTML page with example data.
* Provide some data (constant data or results of AJAX-call).
* Put HTML attributes to control data-binding.    
--> Now, the page is filled with the current data.
* Declare types of DOM parts in `class` and/or `w:type` attributes.
* Create "type handlers" containing "rules". "Rules" covers
  * event handling,
  * derived (computed) values of current data,
  * data transformation, view controls,
  * constant or computed attributes of form fields.
* Furthermore, Weaveworld is highly customizable.

Weaveworld (ῶ) **main features**:
* [Template](doc/doc-1-template.md) engine: example HTML is filled with current data.  
  * [Expression](doc/doc-1-template.md#template-expressions): 
    * current data, (sub)fields, `X\A.B.C`, `true`, `false`, `null`, `undefined`, `0`, `1`, `""`, `''`, expressions
    * `!`, `= !`, `|`, `? :` `[ ]`
  * [Navigation](doc/doc-1-template.md#navigation-condition-iteration): `w:the`, `w:each` (`w:when`), `w:if`, (`w:else`)
  * [Element](doc/doc-1-template.md#property-like-controls) properties: `w:attr:X`, `w:data:X`, `w:style:X`, `w:set:X`, `w:value`, `w:show`, `w:warning`
* [Event-handling](doc/doc-2-event.md): events can be handled in so called "type-handlers" (simple JS objects).
  * [Low-level Event-handling](doc/doc-2-event.md#low-level-event-handling)
  * [High-level Event-handling](doc/doc-2-event.md#high-level-event-handling), `w:on:X`
  * [Event-handling, parameters and return values](doc/doc-2-event.md#event-handling-parameters-and-return-values), _X_`$arg` 
  * `w:on:X:menu`, `w:on:X:data`, `w:on:X:set`, `w:on:X:action`,
* [Two-way data-binding](doc/doc-3-data-binding.md): change of data results DOM-element update.
  * ['Weaving'](doc/doc-3-data-binding.md#weaving---wweave) - `w$refresh`, `w$weave`; [Server call](doc/doc-3-data-binding.md#server-call) - `W$CALL`
  * [Initial data](doc/doc-3-data-binding.md#initial-data) - `W$DATA`, `W$START`; [Initialization](doc/doc-3-data-binding.md#initializing) - `W$ONLOAD`
* "**Type-handlers**": data derivation, transformation, view control, etc.
  * `class`, `w:type`
* "**Super-templates**": setting defaults based on type-handler rules.
  * `w:name`, `w:named`
* **Validation**: basic methods to check and display validation errors.
  * `w:warning`
* **Access-control**: levels of view, update, delete, etc.
  * `w:for`, `w:show:for`, `w:enable:for`
* **(Re)action contexts**, that means complex reactions for events.
  * `w:at`, `at$`_X_
* Basic **localization**: string translation using a dictionary.
