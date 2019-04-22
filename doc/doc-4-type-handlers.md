# Weaveworld (ῶ) - Type-handlers, type-binding #

There are two ways of **type-binding**:
  * "**Context**" (or "class-based") **type-binding**: types of DOM parts are declared as one or more (CSS) classes in the HTML elements' `class` attributes. Context type-binding is used for **event handling** and **transformations**.
  * **Prototype-binding**: the type of the bound element is declared in the `w:the` element, which will be the prototype of the bound data. 
    * For more advanced use, prototype-binding is needed.
    * Usually, prototype-binding is used in addition to the context type-binding, e.g. `<div class="Order Deliverable" w:item w:type=Order>...`

## class ##

**Context type-binding** is based on the HTML elements' `class` attribute.  
By convention, names of type classes start with _uppercase_ letter. Type-declaring classes can also be used in CSS rules. One (mixin) element can have more type declarations.

* Context type-binding (based on `class` attribute) is used in cases of
  * [event-handling](doc-2-event.md) and
  * [transformations](doc-1-template.md#transformations) in expressions.

```js
W$TYPE={ $name:'Product',
    toDate: function(el,v,p){ ...
    },
    doSomething: function(el,ev,arg){ ...
    },
};
```
```html
<div class="Product OtherTypeClass otherCSSClass">
  ...<span w:text="[toDate]date">12/11/2018</span>
  ...<button type=button w:on:onclick=doSomething>Do</button>
</div>
```

## w:type ##

Using the `w:type` attribute, the current bond data will have the declared type-handler as **prototype**, so it has to be used with the `w:item` (which sets current data). Prototype-binding is an extension of context type-binding, so the `w:type` type-name is added to the element's classes if it isn't present.

* **Prototype-binding** (based on `w:type` attribute) provides
  * computed properties,
  * super-template (based on `w:name` and `w:named`) field attributes.

```js
W$TYPE={ $name:'Product',
    quantity$type: 'integer',
    quantity$required: true,
    quantity$min: 1,
    get price(){ return this.unit_price*this.quantity; },
    get vat(){ return this.price*0.15; },
    toDate: function(el,v,p){ ...
    },
    doSomething: function(el,ev,arg){ ...
    },
};
```
```html
<div class="Product OtherTypeClass otherCSSClass" w:item w:type=Product>
  ...<span w:text="[toDate]date">12/11/2018</span>
  ...<input w:name=quantity value=1>
  ...<span w:text="€{{vat}}">€12</span>
  ...<button type=button w:on:onclick=doSomething>Do</button>
</div>
```

## Type-handler registration ##

The suggested way of type-handler **registration** follows the format of an assignment to `W$TYPE`, where the type-handler is defined as a JavaScript object and the type name is given as its `$name` property.

If a type-handler's name is already registered, the earlier definition is used as the **prototype** for the current definition. Using this **incremental type-handler registration** technique, a server (e.g., the ONCE environment) can generate type descriptions, which can be extended by additional 'rules' needed for the page.

```js
// webapp.types.js (server generated)
W$TYPE={ $name:'Product',
    quantity$type:'integer',
    quantity$required:true,
    quantity$min:1,
    get price(){ return this.unit_price*this.quantity; },
    get vat(){ return this.price*0.15; },
};
```

```js
// webapp.js (extensions for the page)
W$TYPE={ $name:'Product',
    toDate: function(el,v,p){ ...
    },
    doSomething: function(el,ev,arg){ ...
    },
};
```
Via `W:TYPE`, type-handlers can be accessed. (E.g., `console.log( W$TYPE.Product );`)


Using the type-handler's `$type` property, the **supertype** can be defined.

```js
W$TYPE={ $name:'Deliverable', 
  ...
};
W$TYPE={ $name:'Product', $type:'Deliverable', // Product is a Deliverable
  ...
};
```

If there's neither `$type` declaration, nor the type was already defined, the type-handler's prototype is set to Weaveworld's root anonymous (`W$TYPE[""]`) type-handler, so its definitions are always usable.

Rules of the root type can be extended or redefined:
```js
W$TYPE[''].toCodeFormat=function(el,v,p){
  ...
};
```

## Type-handler rules ##

Type-handlers are defined as simple JavaScript objects, where its 'properties' are called as **rules**.

* `$name` (string): the name of the type.
* `$type` (string): name of the supertype (i.e., more generalized type).
* **[event handler](doc-2-event.md) definitions** (_function(el,ev,arg)_)
* **[transformations](doc-1-template.md#transformations)** (_function(el,value,pattern)_)
  * By convention, names of transformations start with `to`. (E.g., _toCodeFormat_, _toDate_, _toURL_, ...)
* **derived properties** (`get` getter functions)    
* **super-template** field attributes, e.g.,
  * _field_`$type`: type of the field
  * _field_`$required`: type of the field
  * _field_`$length`: length of the field
  * _field_`$min`: minimum value of a number or date field
  * _field_`$max`: maximum value of a number or date field
* **validators** (_field_`$check`, _field_`$valid`)
* **argument** declarations for event handlers and validators (_fn_`$arg`)
* **(re)action context** event handlers (`$at$`_field_)
* by convention, **enablement** declarations of event handlers have the '`$apt`' postfix (_fn_`$apt`)
* by convention, **permisson** codes are given by the `$for` rule
* and other **helper methods** (a rule can access other rules using `this` keyword)