## Weaveworld (ῶ) - Events ##

First of all, the [DOM event-handling](https://www.w3.org/TR/DOM-Level-2-Events/events.html) can be used, and it overrides Weaveworld's event handling.

Example DOM L2 event-handler:
```html
<button onclick="return handleClick(event)">OK</button>
```
After the page is loaded, Weaveworld is initialized to handle events.


### Low-level Event-handling ###


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
      return null; // it means: not handled
    }
  }
}
```
In case of clicking on `sup`, Weaveworld looks upward and finds the `div` with the `Time` (CSS) named class, what have a registered type and have an onclick "type-handler rule".

### High-level Event-handling ###

In case of an event (not handled otherwise), Weaveworld tries to handle the event, starting from the event target element through parent elements. 

If the element has an an attribute that starts with `w:on:on`... that follows the event name (e.g., `w:on:onclick`), then Weaveworld converts the event.

Let's see an example (See on [jsFiddle](https://jsfiddle.net/weaveworld/bag0kL8p/)):
```js
W$DATA={
  amount:1
};
W$TYPE={ $name:'Amount',
  amountIncrase: function(el,ev){ 
    ++this.amount;
  },
  amountDecrase: function(el,ev){ 
    --this.amount;
  },
}
```

```html
<div class="Amount" w:the>
  <input type="number" name="amount" w:set:value="amount">
  <input type="button" class=wbutton value="+" 
           w:on:onclick=amountIncrase>
  <input type="button" class=wbutton value="-"     
           w:on:onclick=amountDecrase>
</div>
```
In case of clicking on one of the buttons, when Weaveworld find a `w:on:onclick` attribute, then the event will be converted using the attribute value.



### Event-handling, arguments and result ###
