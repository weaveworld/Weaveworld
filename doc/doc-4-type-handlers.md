# Weaveworld (ῶ) - Type-handlers, type-binding #

## class ##

Basic type-binding is based on the HTML class attribute of elements.  
By convention, the type class starts with uppercase letter. However, that class can also be used in CSS rules.

* Basic type-binding (based on `class` attribute) is used in cases of
  * event-handling
  * transformations in expressions

```js
W$TYPE={ $name:'Product',
    toDate: function(el,v,p){ ...
    },
    doSomething: function(el,ev,arg){ ...
    },
};
```
```html
<div class="Product otherCSSClass">
  ...<span w:text="[toDate]date">12/11/2018</span>
  ...<button type=button w:on:onclick=doSomething>Do</button>
</div>  
```

## w:type ##

Using the `w:type` attribute, the current data of data-binding will have the declared type-handler as **prototype**, so it has to be used with the `w:the`, what sets current data.

* Prototype type-binding (based on `w:type` attribute) provides
  * computed properties,
  * super-template (based on `w:name` and `w:named`) field attributes.

```js
W$TYPE={ $name:'Product',
    quantity$type:'integer',
    quantity$required:true,
    quantity$min:1,
    get price(){ return this.unit_price*this.quantity; },
    get vat(){ return this.price*0.15; },
    toDate: function(el,v,p){ ...
    },
    doSomething: function(el,ev,arg){ ...
    },
};
```
```html
<div class="Product otherCSSClass" w:the w:type=Product>
  ...<span w:text="[toDate]date">12/11/2018</span>
  ...<input w:name=quantity value=1>
  ...<span w:text="€{{vat}}">€12</span>
  ...<button type=button w:on:onclick=doSomething>Do</button>
</div>
```

## Type-handler registration ##

The suggested way of type-handler **registration** follows the format of an assignment to `W$TYPE`, where the type-handler is given as object and the type name is given as its `$name` property.

In case of the type-handler of the name was already registered, then the earlier definition is used as the prototype for the current definition. Using this technique, a server (such as the ONCE environment) can generate type descriptions which can be extended by the 'rules' needed for the page.

```js
W$TYPE={ $name:'Product', // server generated
    quantity$type:'integer',
    quantity$required:true,
    quantity$min:1,
    get price(){ return this.unit_price*this.quantity; },
    get vat(){ return this.price*0.15; },
};
```

```js
W$TYPE={ $name:'Product', // extensions for the page
    toDate: function(el,v,p){ ...
    },
    doSomething: function(el,ev,arg){ ...
    },
};
```
Through the `W:TYPE` type-handlers can be accessed, e.g., `console.log( W$TYPE.Product );`


Using the `$type` property of the type-handler, the supertype can be defined.

```js
W$TYPE={ $name:'Deliverable', 
  ...
};
W$TYPE={ $name:'Product', $type:'Deliverable', // specialized type
  ...
};
```

If there's neither `$type` declaration, nor the type was already defined, the type-handler's prototype is to the Weaveworld's root anonymous (`W$TYPE[""]`) type-handler, so its definitions are always usable.

Rules of the root type can be extended or redefined:
```js
W$TYPE[''].toCodeFormat=function(el,v,p){
  ...
};
```

## Type-handler rules ##

Type-handlers are defined as simple JavaScript objects, where its 'properties' are called as **rules**.

* `$name` (string): the name of the type.
* `$type` (string): the supertype (more generalized type).
* **event handler definitions** (_function(el,ev,arg)_)
* **transformations** (_function(el,value,pattern)_)
  * By convention, names of transformations start with 'to'.
* **derived properties** (`get` getter function)    
* **super-template** field attributes, e.g.,
  * _field_`$type`: type of the field
  * _field_`$required`: type of the field
  * _field_`$length`: length of the field
* **validators**  (_field_`$check`, _field_`$valid`)
* **argument** declarations for event handlers and validators (_fn_`$arg`)
* **enablement** declarations for event handlers (_fn_`$apt`)
* **(re)action context** event handlers (`$at$`_field_)
* by convention, **permisson** code is given by the `$for` rule
* and other **helper methods** (a rule can access others using the `this`)