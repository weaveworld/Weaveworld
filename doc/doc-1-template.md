# Weaveworld (ῶ) - Templates #

Using Weaveworld, one can create HTML pages with example data, and can use it as templates, what will be actualized based on the current data.
Initially, the value of W$DATA is used.   

(During initialization, Weaveworld transforms DOM into a lightweight representation, what will be used during actualization. For production use, a filter program can create more compact pages without the examples.)

## Template control ##

Template engine can be controlled by specific element attributes, which are started by the `w:` prefix.    
Most attributes are handled as macros.     

If there's no `{{` in the attribute, then the whole attribute is evaluated as an expression.
* e.g., `<sup w:text="code">1234</sup>`

If there are one or more `{{` signs in the attribute, then they will be evaluated and replaced by the result.
* e.g., `<sup w:text="[{{parent}}-{{code}}]">[x12-1234]</sup>`

That means, that `"X"` and `"{{X}}"` are handled in the same way.

## Template expressions ##
Weaveworld has a very limited (but fast) expression language, which main goal is to access, transform and check parts of data. 
Using "`[]` transformations", _full control_ (!) can be gained.   

During template actualization, there is a current value; initialy the value of W$DATA.

In case of conditionals, values are considered false, if they're `undefined`, `null`, `false`, `0`, `""` or an empty array (!); otherwise they're considered as true.

Building blocks of expressions (from higher to lower precedence):

* **Field, value, expression**
  * empty expression means **current data**, so empty `w:item` means "the current data"   
    e.g., `<div w:item="">...` or `<div w:item>...`
  * **field** (containing letters, `$`, `@`, `_` and digits, and not started with digit)   
    e.g., `<input w:attr:maxlength="name$length"...`
  * **subfield**: A`.`B means subfield B of field A,   
    e.g., `list.length`
  * **field of a context**: A`\`B means field B in context A, where empty context is the root  
    e.g., `Group\name` looks upward for a Group and gets its name  
    e.g., `\user.name` looks from the root (W$DATA) and gets the user's name
  * **value**: `true`, `false`, `null`, `undefined`, `0`, `1`, `""`, `''`
  * simple **expression** (limited)  
    e.g., `<span w:text="'none'">`...      
    
* **Negation (complement)**: `!`A
  * e.g., `<div w:show="!list"`... - if the list is empty
    
* **Comparison (`=`, `!`)**: A<sub>{</sub>`=`V<sub>}</sub><sub>{</sub>`!`X<sub>}</sub>  
  It checks if A equals one of the '=' values, but not equals none of the '!' values.
  * e.g., `<div w:show="code='x'='y'"` ... - the code is 'x' or 'y'
  * e.g., `<div w:show="code!'a'!'b'"` ... - the code is neither 'a' nor 'b'

* **"or" (`|` sign)**: A<sub>{</sub>`|`B<sub>}</sub>    
  The first true-ish value or false.
  * e.g., `... w:show="code='x'='y'|isAdmin|pass"` ...: if the code is 'x' or 'y', or isAdmin or pass is considered as true
  
* **Conditional expression (`?` and `:`)**: A<sub>[</sub>?X<sub>]</sub><sub>[</sub>:Y<sub>]</sub>     
  if A is considered as true, then X else Y.
  * e.g., `... w:style:font-weight="list?'bold':'none'"...`
  * e.g., `... w:text="list.length:'(none)'"...`: default for the value
   
* **Transformation (prefix `[` and `]`)**: `[`TR <sub>[</sub>PATTERN<sub>]</sub>`]`V    
  Uses TR transformation on the V value. An optional literal pattern can be given.  
  Transformations are mostly defined in type-handlers.
  * e.g., `... w:text="[toUppercase][toCountText]count"`
  

## Transformations ##

Transformation *search order*:

**1.** Type-handlers of the element and its parents.

A transformation can be defined as a function "rule" in the typehandler. Parameters are:
* _el_: the processed element. (Thus the element attributes or the content can be changed!)
* _v_: the value to be changed.
* _p_: the (optional) literal pattern.

```js
W$TYPE={ $name:'Order',
    toFixed: function(el,v,p){
      return String(v.toFixed(p?Number(p):0));  
    },
}
```
```html
<div class=Order>
  ... <span w:text="${{[toFixed 2]price}}">199.99</span> ...
```

**2.** Basic transformations. (See below.)


**3.** Global object's functions. Parameters: _value_ and optional literal _pattern_.

```js
function toIndentation(v,p){ 
  return ((v-1)*10)+"px";
} 
```
```html
<a w:style:margin-left="[toIndentation]level" 
  w:attr:href="[encodeURIComponent]url">...
```

### Basic transformations ###

Initially Weaveworld has the following built-in transformations:

* condition-conversion
  * `[?]`: condition conversion to `true` or `false`    
    * e.g., `<div w:attr:contenteditable="[?]code$isEditable"` ...
    * e.g., `<div w:show="[?]details"` ...   
  * `[?? `<sub>[</sub>`'`_string_`'`<sub>]</sub>`]`: conversion to "HTML conditional", that is the _string_ (default is empty string) or `null`.
     * e.g., `<input type=radio w:attr:checked="[??]code='1'" value="1"` ...
     * e.g., `<input type=radio w:attr:checked="[?? 'checked']code='1'" value="1"` ...  
  * `[?1]`: conversion to `1` or `0`
    * e.g., `<div w:data:open="[?1]opened"` ...
* complementer condition-conversion
  * `[!]`: complementer condition to `false` or `true`.
    * e.g., `<div w:attr:contenteditable="[!]comment$isLocked"` ...
  * `[!! `<sub>[</sub>`'`_string_`'`<sub>]</sub>`]`: conversion to "HTML conditional", that is `null` or the _string_ (default is empty string).
  * `[!1]`: conversion to `0` or `1`.
* `[{} `<sub>[</sub>FIELD_ASSIGNS<sub>]</sub>`]`: extracts values into an object. 
    * e.g., `<div w:item="[{}]"` ... - uses a new empty object

(Transformations are performed via `w$is` and `w$toggle` redefinable utility functions)

## Type-binding (class, w:type) ##      

Basic data-binding and event handling are performed by default.

For advanced use, type-binding is needed.

  
## Navigation, condition, iteration ##  
  
* **w:item** - navigates to the data, and that will be the current data.  
Empty `w:item` means "current data".
  * e.g., `<div w:item="group"` ... - uses the group field of the current data.
  * e.g., `<div w:item` ... - uses the current data.
  * e.g., `<body w:item=""` ... - uses (the base) W$DATA.

The following example navigates to the `user` and uses its `email`.
```html
<div w:item="user">
  <div w:text="email"></div>
</div>
```

* **w:if** - child elements of the content are used only if the value is true-ish.

  * An optional `w:else` can be given for an alternate content.

```html
<div w:if="user">
  <div w:text="user.email"></div>
  <w:else>
    <button w:on:onclick=login>Please, login!</button>
  </w:else>
</div>
```

* **w:each** - navigates to the value, and iterates on it.

There basic form is the following: the outer element is marked by a `w:each`, and one or more inner elements are marked by an empty `w:item`, as "the current data". During iteration only the first marked element will be used as the template.

```html
<ul w:each=list>
  <li class=Todo w:item>
    <button w:on:onclick=todoDelete>-</button> 
    <span  w:text=name>Todo 1</span>
  </li>
  <li w:item>
    <button>-</button> 
    <span>Todo 2</span>
  </li>
</ul>
```

The general form of `w:each` is the next:
* The elements before the first item are the _headers_.
* First item is used as the _iterated pattern_.
* Elements between the first and second items are used as _separators_.
* Elements after the last elements are used as _footers_.
* An optional `w:else` can be used as replacement, if there's no iterable item at all.

There's a shorthand version, where the w:each and the empty w:item is given by the same element, so that will be repeated.

```html
<div w:each=list w:item>
  <button>-</button><span w:text=name>item</span>
</div>
```

Using w:each there's an optional **w:when** attribute, what can filter the results.

```html
<div w:each=list w:when="!deleted" w:item>
  <button>-</button><span w:text=name>item</span>
</div>
```

## Property-like controls ##  

* **w:text** - sets the element text (i.e., the `textContent`).
  * e.g., `<span w:text=code` ...

* **w:html** - sets the element's HTML content (i.e., the `innerHTML`).
  * e.g., `<div w:html=descr` ...

* **w:attr:X** - sets or removes the given attribute.
  * e.g., `<div w:attr:title="descr$title"` ...

* **w:data:X** - sets or removes the given 'data-' prefixed attribute.
  * e.g., `<div w:data:open="hasItems?1:0"` ...

* **w:style:X** - sets or removes the given style attribute.
  * e.g., `<span w:style:fontWeight=loggedin?'bold':'normal'` ...
  * e.g., `<span w:style:width="{{o_hir|17.7}}%"` ...

* **w:set:X** - sets or removes the given property of the element.
  * e.g., `<select w:set:value=areacode` ...

* **w:show** - Element is shown only if the expression value is considered as true.
  * e.g., `<select w:show="code=1=2"` ...

* **w:warning** - sets the element's custom validity property.
  * e.g., `<input type=text name=email w:warning=email$warning` ...




