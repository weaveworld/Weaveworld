# Weaveworld

**Weaveworld (ῶ)** is an experimental framework for interactive web applications, to provide the theoretically shortest (!) representation for "data-intensive" applications (forms, etc.) using simple HTML and JS techniques, without loss of readability. Only basic (!) HTML/CSS/JavaScript(ES6 or ES5) skills are required to create applications.

**License**: it is _free_ to use, but _**not** open-source_ during its experimental phase (i.e., it is not allowed to use elsewhere parts or modified versions of the source, however the framework is totally customizable). Weaveworld is about the one tenth of the Weaveworld-ONCE web framework. Patent pending for the "type-binding" technique. See: [licence](LICENSE).

Usage (current version: 0.10.190322; suggested use: 0.10):
```html
  <script src="https://cdn.jsdelivr.net/gh/weaveworld/Weaveworld@VERSION/w.min.js"></script>
  <link href="https://cdn.jsdelivr.net/gh/weaveworld/Weaveworld@VERSION/w.css" rel="stylesheet"/>
```

Using ῶ is extremely simple. (see: A [simple example to do list](demo/simple-todo).)
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

Weaveworld (ῶ) main features:
* **Template** engine: example HTML is filled with current data.
* **Two-way data-binding**: change of data causes DOM-element update.
* Event-handling: events can be handled in so called "type-handlers" (simple JS objects).
* (Re)action contexts, that means complex reactions for events.
* "Type-handlers": data derivation, transformation, view control, etc.
* "Super-templates": setting defaults based on type-handler rules.
* Access-controls: levels of view, update, delete, etc.
* Validation: basic methods to check and display validation errors.
* Basic localization: string translation using a dictionary.