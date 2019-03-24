# Weaveworld (ῶ) - Data-binding #

Weaveworld has a two-way data binding in ECMAScript 6 environment, so changing fields of data (e.g., in event handler definition) causes actualization of the corresponding HTML elements.

## 'Weaving' - w$weave ##

Actualization can be directly invoked (e.g., in ECMAScript 5 environment) via the `w$refresh('now',el)` call, where el is the element to be actualized.

There is a `w$weave` utility function to make easy to change data. It has a base HTML element, what has the current data or list of data-binding, has a mode, how to change the current data or list, and has the change data object.

`w$refresh` automatizes most of the typical data changes, what can be performed only by a simple call.

```js
W$TYPE={ $name:'Order',
};
W$TYPE={ $name:'Item',
  addItem$arg:"order:Order\\order_id",
  addItem: function(el,ev,arg){
    weave(el,']',arg);
  },
  removeItem$arg:"id",
  removeItem: function(el,ev,arg){
    weave(el,'-');
  },
};
```

`w$weave`(_el_, _mode_, _object_):
* _el_: the element as the 'base' for the data change; in case of event handling, it is mostly the first (element) argument.
* _mode_: an optional prefix and a code, what specifies the change
  * the mode may have a prefix
    * '~': no clearing of warnings and no w$refresh
    * '!': clearing of warnings and w$refresh
    * if there's no prefix, then the true or false value of the WEAVEWORLD.W$REFRESH determines, if the '!' (in case of true) or the '~' (in case of false) is considered as default. Currently, it is set to true.
  * the code can be one of the following
    * '' (empty string) - it **merges** the fields of the _object_ into the current value.
    * '[' - it adds the _object_ at the **beginning** of the list.
    * ']' - it adds the _object_ at the **end** of the list.
    * '<' - it inserts the _object_ into the list **before** the current data.
    * '>' - it inserts the _object_ into the list **after** the current data.
    * '-' - it **deletes** the current data from the list.
    * '.' - it **replaces** in the list the current data with the _object_.
    * '#' - it **replaces the list** with the _object_ (what has to be an array).
    * '=' - it **replaces the current data** with the _object_; it <u>does perform</u> a w$refresh.
    * '?' - it only loads **warnings**; it <u>does not perform</u> w$refresh.
* _object_: the data.

The steps of `w$weave`:
1. Firstly, it may clear warnings for the data (namely, all the fields which ends with '$warning' is set to `undefined`).
2. It changes the current data.
3. It sets warning fields (for all the _w_ prefixed fields of the change, the '$warning' postfixed field is set).
4. It may perform a `w$refresh` on the element.

To learn more about warnings, see: validation.

## Server call ##

It is suggested to define a function to perform server (AJAX) calls, e.g., `W$CALL`. (The `w$ajax` utility function can be used as helper. For REST, on may want to define W$GET, W$PUT, etc. functions.)

Currently, the `W$CALL` is defined to be fit to the ONCE server environment (what is the server side part of the Weaveworld-ONCE environment). 

`W$CALL`(_cmd_, _object_, <sub>[</sub>_element_, <sub>[</sub>_weave_mode_, <sub>[</sub>_weave_data_<sub>]]]</sub>)
*  _cmd_: the name of the server function to be called
* _object_: arguments of the call
* _element_: the base element for weaving
* _weave_mode_: the weave mode; if it is not specified but the _element_ is, the default mode is '' (i.e., merge).
* _weave_data_: this parameter overrides the data to be weaved. The default data to be weaved is the result of the server call.

`W$CALL`(_cmd_, _object_, _function_): an alternate form with a callback function.

```js
W$TYPE={ $name:'Order',
};
W$TYPE={ $name:'Item',
  addItem$arg:"order:Order\\order_id",
  addItem: function(el,ev,arg){
    W$CALL('addItem',arg,el,'.'); 
    // the newly created item in the response replaces the current one
  },
  setItem$arg:"id",
  setItem: function(el,ev,arg){
    W$CALL('setItem',arg,el); // (default) merge and warnings
  },
  removeItem$arg:"id",
  removeItem: function(el,ev,arg){
    if(arg.id) W$CALL('removeItem',arg, el,'-'); // remove
  },
};
```

## Initial data ##

The actual way to get initial data is determined by the `W$DATA` and the `W$START` variables.

* **No data**, that means no template actualization. This way the page can be viewed in its raw form, containing only example data.
  * W$DATA and W$START are both undefined.
* **Inline data** is used, when the server performs some initial function and the server modifies the page as the result data is put directly into the page as a JavaScript assignment.
  * W$DATA is defined.
  * If W$START is a function, then it is called with the W$DATA argument.
* **Parameters** as data. This is used, when the page can start itself with the optional (GET) parameters.
  * W$DATA is left undefined.
  * W$START is a function, what is called with the optional (GET) parameters as arguments.
* **Server data**
  * W$DATA is left undefined.
  * W$START is a string.
  * `W$CALL` is called with the W$START parameter and the (GET) parameters.

The last two ones are the "clean ways": no need to modify the page on the server.

## Initializing ##

The steps of initializing are the followings:
* Firstly, Weaveworld converts the page into an effective **template** format. In the meantime,
  * The content of `<!--!w:css!  -->` comments are added as CSS rules.
  * The content of `<!--!w:script!  -->` comments are added as JavaScript fragments.
  * (These comments are subjects of direct localization.  
  In production, a filter can transform the HTML into effective HTML/JS/CSS files.)
* Weaveworld determines the **initial data**, based on the W$DATA and W$START.
* If there are some data, so W$DATA and W$START are not both undefined, then
  * The page as template is **actualized** based on the current data.
  * The functions of the `W$ONLOAD` array are called. (Functions can be put into the W$ONLOAD which should run after the actualization.)
  * If the `W$SYNC` is defined as a function, it is called. (It can be used for asynchron update calls.)

```js
W$ONLOAD.push(function(){ 
  console.log('The page is actualized...'); // add to the end
})
W$ONLOAD.unshift(function(){ // it adds to the beginning 
  console.log('First of all'); 
})
```