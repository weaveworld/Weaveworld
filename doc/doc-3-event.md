## Weaveworld (ῶ) - Events ##

First of all, the [DOM event-handling](https://www.w3.org/TR/DOM-Level-2-Events/events.html) can be used, and it overrides Weaveworld's event handling.

Example DOM L2 event-handler:
```html
<button onclick="return handleClick(event)">OK</button>
```
After the page is loaded, Weaveworld is initialized to handle events.


### DOM events ###


In case of an event (not handled by otherwise) Weaveworld tries to make "type-binding", starting from the event target element through parent elements it checks if one of the element (CSS) class name is registered as a type-handler.

Let's see the following element ([jsFiddle](https://jsfiddle.net/weaveworld/630xncta/)):
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
In case of a click
