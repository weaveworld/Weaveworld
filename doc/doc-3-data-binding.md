# Weaveworld (ῶ) - Data-binding #

Weaveworld has a two-way data binding in ECMAScript 6 environment, so changing fields of data (e.g., in event handler definition) causes actualization of the corresponding HTML elements.

## 'Weaving' - w$weave ##

Actualization can be directly invoked (e.g., in ECMAScript 5 environment) via the `w$refresh('now',el)` call, where `el` is the element to be actualized.

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
    * '=' - it **replaces the current data** with the _object_; it _does perform_ a w$refresh.
    * '?' - it only loads **warnings**; it _does not perform_ w$refresh.
* _object_: the data.

The steps of `w$weave`:
1. Firstly, it may clear warnings for the data (namely, all the fields which ends with '$warning' is set to `undefined`).
2. It changes the current data.
3. It sets warning fields (for all the _w_ prefixed fields of the change, the '$warning' postfixed field is set).
4. It may perform a `w$refresh` on the element.

To learn more about warnings, see: validation.

## Server call ##

It is suggested to define a function to perform server (AJAX) calls, or redefine `W$CALL`. (The `w$ajax` utility function can be used as helper. `W$CALL` sets the `Pragma: W$CALL` header by default, so servere can identify these requests.)

Currently, `W$CALL` is defined to be fit to REST APIs and "ONCE-style" server calls (ONCE is the server side part of the Weaveworld-ONCE environment).

`W$CALL`(_cmd_ <sub>[</sub>,_arg_<sub>]</sub>
     <sub>[</sub>,_element_ <sub>[</sub>,_weaving_mode_ <sub>[</sub>,_weaving_data_<sub>]]]</sub>)
*  _cmd_ has two formats based on that if there is or isn't a colon inside the _cmd_:
    * _METHOD_<sub>[</sub>.json<sub>]</sub>:<sub>[</sub>_URL_<sub>]</sub> – This format is mainly used for REST API.
      * Performs an AJAX call via _METHOD_. Using the `.json` postfix, arguments are sent as JSON (instead of `application/x-www-form-urlencoded`)
      * Usually _URL_ is relative to the [base URL](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).
      * E.g., `W$CALL('GET:task',el)`
      * E.g., `W$CALL('DELETE:task/'+this.id,el,'-')`
      * E.g., `W$CALL('POST:task/'+this.id,arg,el)`
      * E.g., `W$CALL('POST.json:task/'+this.id,arg,el)`
    * the **name** of the server function to be called – this is a POST request for the [base URL](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) with JSON arguments. 
      * (In case of "ONCE-style" AJAX calls)   
* _arg_: arguments of the call
* _element_: the base element for weaving
* _weaving_mode_: the weave mode; if it is not specified but the _element_ is, the default mode is '' (i.e., merge).
* _weaving_data_: this parameter overrides the data to be weaved. The default data to be weaved is the result of the server call.

`W$CALL`(_cmd_ <sub>[</sub>,_arg_<sub>]</sub>, _function_): an alternate form with a callback function.

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
    W$CALL('setItem',arg,el); // (default weaving) merge and warnings
  },
  removeItem$arg:"id",
  removeItem: function(el,ev,arg){
    if(arg.id) W$CALL('removeItem',arg, el,'-'); // remove
  },
};
```

## Initial data ##

The actual way to get initial data is determined by the `W$DATA` and the `W$START` variables.

* **No data**: `W$DATA` and `W$START` are both **undefined** (this is the default).
  * This case means no template actualization. This way the page can be viewed in its raw form, containing only example data.
* **Server data**: `W$START` is a **string** and `W$DATA` can be given.
  * In this case `W$CALL` is called with the `W$START` parameter and `W$DATA` arguments and the result is used for data-binding.
  * E.g., `W$START="GET:/task";`
  * E.g., `W$START="GET:/qr"; W$DATA=w$getParameters();` // using (http) GET parameters 
  * E.g., `W$START="GET:/q"; W$DATA=w$getParameters({extended:1});` // using (http) GET parameters with defaults
* **Inline data**: `W$DATA` is **defined** and `W$START` can be a function, and then it is called with the W$DATA argument, so its result will be used for data-binding.
  * This method is used, when the server modifies the page using some results of server and data is put directly into the page as a JavaScript assignment. (This can be used when HTML pages are targeted with POST requests.) 
  * This method can also be used for example or constant data.
* **Parameters** as data: `W$DATA` is **undefined**, but `W$START` is a **function**, which is called with the (GET) parameters as arguments.
  * This is used, when the page can start itself with the optional (GET) parameters.
  
## Initializing ##

The initializer steps are the followings:
* Firstly, Weaveworld converts the page into an effective **template** format. In the meantime,
  * The content of `<!--!w:css!  -->` comments are added as CSS rules.
  * The content of `<!--!w:script!  -->` comments are added as JavaScript fragments.
  * (These comments are subjects of direct localization.  
  In production mode, a filter can transform the HTML into effective and localized HTML/JS/CSS files.)
* Weaveworld determines the **initial data**, based on the W$DATA and W$START.
* If there are some data, so W$DATA and W$START are not both undefined, then
  * The page as template is **actualized** based on the current data.
  * The functions of the `W$ONLOAD` array are called. (Functions can be put into the W$ONLOAD which should run after the actualization.)
  * If the `W$SYNC` is defined as a function, it is called. (It can be used for asynchron update calls.)

```js
W$ONLOAD.push(function(){ 
  console.log('The page is actualized...'); // appendig at the end
})
W$ONLOAD.unshift(function(){ // inserting at the beginning 
  console.log('First of all...'); 
})
```