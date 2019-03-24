# Weaveworld (ῶ) - Events #

First of all, the [DOM event-handling](https://www.w3.org/TR/DOM-Level-2-Events/events.html) can be used, and it overrides Weaveworld's event handling.

Example DOM L2 event-handler:
```html
<button onclick="return handleClick(event)">OK</button>
```
After the page is loaded, Weaveworld is initialized to handle events.


## Low-level Event-handling ##


In case of an event (not handled otherwise), Weaveworld tries to make a "type-binding", starting from the event target element through parent elements, it checks if one of the element (CSS) class name is registered as a type-handler.

Let's see the following element (see on [jsFiddle](https://jsfiddle.net/weaveworld/630xncta/)):
```html
<div class="Time t-container">
  <input type="number" name="hour" value=23
    ><sup class=wbutton name="x-hour">X</sup>
  <input type="number" name="minute" value=59
    ><sup class=wbutton name="x-minute">X</sup>
  <input type="number" name="second" value=59
    ><sup class=wbutton name="x-second">X</sup>
</div> 
```

Now we register the type-handler, named 'Time'. (Type-handler registration follows the form of an assignment.)

```js
W$TYPE={ $name:'Time',
  onclick: function(el,ev){ var e=ev.target;
    if(e.nodeName=='SUP' && e.getAttribute("name").startsWith('x-')){
      e.previousElementSibling.value=null;
    }else{
      return null; // that means: not handled
    }
  }
}
```
In case of clicking on `sup`, Weaveworld looks upward and finds the `div` with the `Time` (CSS) class, what have a registered _type-handler_ and have an onclick _rule definition_.

## High-level Event-handling ##

In case of an event (not handled otherwise), Weaveworld tries to handle the event, starting from the event target element through parent elements. 

If the element has a matching _event declaration_, that is an attribute that starts with `w:on:`... that follows the 'on' and the event name (e.g., `w:on:onclick`), then Weaveworld converts the event and tries to find the _event handler definition_ for that name in _type-handlers_. 

Let's see an example (See on [jsFiddle](https://jsfiddle.net/weaveworld/bag0kL8p/)):
```js
W$DATA={
  product:{ id: 123456, name: 'bulb', amount:1 }
};
W$TYPE={ $name:'Amount',
  increaseAmount: function(el,ev){ 
    ++this.amount;
  },
  decraseAmount: function(el,ev){ 
    --this.amount;
  },
}
```

```html
<div class="Amount" w:the=product>
  <input type="number" name="amount" w:set:value="amount">
  <!--!w:css! div.Amount>input[name="amount"]{ max-width:4em; }--> 
  <input type="button" class=wbutton value="+" 
           w:on:onclick=increaseAmount>
  <input type="button" class=wbutton value="-"     
           w:on:onclick=decraseAmount>
</div>
```
In case of clicking on one of the buttons, when Weaveworld find a `w:on:onclick` attribute, the event name will be converted using the attribute value.

Events may have **arguments**, given as JSON object. Because JSON uses quotation marks, it is practical to write the attribute value between apostrophes.

(See on [jsFiddle](https://jsfiddle.net/weaveworld/q90vrdjh/))
```js
W$DATA={
  product:{ id: 123456, name: 'Bulb', amount:1 }
};
W$TYPE={ $name:'Amount',
  changeAmount: function(el,ev,arg){ 
    this.amount+=arg.n;
  },
}
```

```html
<div class="Amount" w:the=product>
  <input type="number" name="amount" w:set:value="amount">
  <!--!w:css! div.Amount>input[name="amount"]{ max-width:4em; }--> 
  <input type="button" class=wbutton value="+" w:on:onclick='changeAmount{"n":1}'>
  <input type="button" class=wbutton value="-" w:on:onclick='changeAmount{"n":-1}'>
</div>
```

Weaveworld handles an optional `$arg` definition for the event. Firstly, the arguments are collected based on the current value (in case of a named element with value it is added, too), and after that arguments of the event declaration are added. 

* `$arg` format: argument specifications, separated by _commas_,   
where an argument specification
    * _name_ (that is a shorthand for _name_=_name_) or
    * _name_`:`[template expression](doc-1-template.md#template-expressions) (based on the current value).
    
It is suggested to use the redefined W$CALL function to make server (AJAX) calls. (It is also suggested to handle 'weaving' in the W$CALL for the element, that is to actualize the current data of the element.) Using the `$arg` feature, the arguments for the server call can be prepared.

```js
W$DATA={
  product:{ id: 123456, name: 'Bulb', amount:1 }
};
W$TYPE={ $name:'Amount',
  changeAmount$arg: "w$call:'changeAmount',id",
  changeAmount: function(el,ev,arg){ 
    this.amount+=arg.n;
    console.log(arg);
    // W$CALL(arg,el)
  },
}
```


## Event-handling, parameters and return values ##

**Event handler** ('rule') **parameters** (_el_,_ev_,_arg_):
* `this`: current data (of data binding, which prototype is the type-handler).
*  _el_: the element of _type-binding_, that is the element with the class attribute, which declares the type, that is defined as a type-handler.
* _ev_: the original event.
  * `ev.target` can be used to get the target element of the original event.
* _arg_: arguments, collected by the $arg definition and event declaration (JSON) arguments.

**Event handler** ('rule') **return value**:
  * `undefined` (e.g., no return statement at all): the event is handled.
  * `null`: the event is not handled, so Weaveworld has to keep on to look for the handler.  
  (_preventDefault_, _cancelBubble_, _stopPropagation_, )
  * `false`: the event is partially handled, only the default action has to be performed.  
  (_cancelBubble_, _stopPropagation_)

**Event declaration arguments** are given as JSON object. 
  * Arguments are processed only if there's a (maybe empty object, i.e., `{}`) JSON value.
  * Firstly, the _event name_`$arg` is processed. Format: argument specifications, separated by _commas_,   
where an argument specification
    * _name_ (that is a shorthand for _name_=_name_) or
    * _name_`:`[template expression](doc-1-template.md#template-expressions) (based on the current value).
  * The data of the JSON arguments are added.
  * If the HTML element has the `w:name` or `name` attribute, and has a `w:value` attribute or the `value` property, then it is added.
    * e.g., `<input type=text name=code w:on:onchange:action="{}">` - changing the input field to xy causes an action with the argument { code: "xy" }


HTML element's event handling declarations can be the followings (in the order of execution):

* `w:on:X:menu='`_name_<sub>[</sub>`{`_json_`}`<sub>]</sub>`'` - starts the **menu** of the given name (no other event processing)
* `w:on:X:data='`<sub>[</sub>_target_<sub>]</sub><sub>[</sub>`{`_json_`}`<sub>]</sub>`'` - sets **data attributes** (what are mostly used by CSS controls)
  * the optional _target_ follows the w$query format; default target is the HTML element of the first type-binding
  * e.g., `<span w:on:onclick:data='{"open":1}' w:on:onclick="">Open</span>` - sets the data-open="1" attribute
  * e.g., `<span w:on:onclick:data='{"open":null}' w:on:onclick="">Open</span>` - removes the data-open attribute
* `w:on:X:set='{`_json_`}'` - directly sets **properties of the current data** (of data-binding)
  * e.g., `<span w:on:onclick:set='{"open":1}' w:on:onclick="">Open</span>` - sets the current data's "open" property to 1
* `w:on:action='{`_json_`}'` - creates an **action** in the _(re)action context_
  * e.g., `<span w:on:onclick:action='{"open":1}' w:on:onclick="">Open</span>` - triggers an action with the "open:1" argument
* `w:on:X='`<sub>[</sub>_name_<sub>]</sub><sub>[</sub>`{`_json_`}`<sub>]</sub> - event handling declaration
  * _name_: the redefined name
  * if the _name_ is empty, that means that the event is handled, no further event handling is needed
