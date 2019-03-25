## Weaveworld simple To Do list (tutorial) ##

Using Weaveworld is extremely simple.

(See the example on [jsFiddle](https://jsfiddle.net/weaveworld/0xc8kLah/).)

### HTML with example data ###

Firstly, let's create a simplified HTML page `simple-todo.html` with some example data, and an empty `simple-todo.js` file.
The HTML includes Weaveworld's js and css files, too.

The page can be opened by a browser and can be designed using some classes and CSS.

```html
<!DOCTYPE html><html><head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <<title>Weaveworld To Do List</title>
  <script src="https://cdn.jsdelivr.net/gh/weaveworld/Weaveworld/w.js"></script>
  <link href="https://cdn.jsdelivr.net/gh/weaveworld/Weaveworld/w.css" rel="stylesheet"/>
  <script src="simple-todo.js"></script>
</head>
<body>
  <div>
    <h3><span>To Do List</span> <sup>(2)</sup></h3>
    <ul>
      <li>
        <button>-</button> <span>Todo 1</span>
      </li>
      <li>
        <button>-</button> <span>Todo 2</span>
      </li>
    </ul>
    <blockquote>
      <form>
        <input type=text name=name>
        <button>+</button>
      </form>
    </blockquote>
  </div>
</body></html>
```

### Simple data-binding ###

Now, we put some data into the `simple-todo.js` file.

```js
W$DATA={
  data:{ title:'My list' },
  list: [
	  { name: 'clean the house' },
	  { name: 'buy milk' },
	]
};
```

The HTML is used as template, as we declare data-binding controls. (See the `w:` prefixed attributes.)   
Now in a browser, the actualized content appears.

```html
...
<body class=w>
  <div w:the>
    <h3><span w:text=data.title>To Do List</span> 
      <sup w:text="({{list.length}})">(2)</sub>
    </h3>
    <ul w:each=list>
      <li w:the>
        <button>-</button> 
        <span w:text=name>Todo 1</span>
      </li>
      <li w:the><button>-</button><span>Todo 2</span></li>
    </ul>
    <blockquote>
      <form>
        <input type=text name=name> 
        <button>+</button>
      </form>
    </blockquote>
  </div> 
</body></html>  
```

1. `<body class=w>` - the "class=w" attribute provides that only the actualized content is shown.
2. `<div w:the>` - "w:the" means _"the current data"_, so we use the current data.
3. `<span w:text=data.title>` - the element's text content will be replaced to the referenced data.
4. `<sup w:text="({{list.length}})">` - double curly brackets trigger macro replacement in the text.
5. `<ul w:each=list>` - iterating over the data.
6. `<li w:the>` - the first element will be the repeated template, and inside that the current data is the base data.

### Simple type-binding and event-handling  ###

Let's declare types of the DOM-parts using the `class` attribute (see `class=TodoList` and `class=Todo`). (Names of type classes are started with uppercase by convention.) These CSS classes can be used in CSS rules, too.

```html
...
<body class=w>
  <div class=TodoList w:the>
    <h3><span w:text=data.title>To Do List</span>
      <sup w:text="({{list.length}})">(2)</sub>
    </h3>
    <ul w:each=list>
      <li class=Todo w:the>
        <button w:on:onclick=todoDelete>-</button>
        <span w:text=name>Todo 1</span>
      </li>
      <li w:the>
        <button>-</button> 
        <span>Todo 2</span>
      </li>
    </ul>
    <blockquote>
      <form w:name="todoAdd" w:the="[todoNew]">
        <input type=text class=winput w:name=name size=20>
        <button>+</button>
      </form>
    </blockquote>
  </div> 
</body>
```

Now we declare the event-handler for the "-" button (see the `w:on:onclick=todoDelete` attribute).

```html
...
    <ul w:each=list>
      <li class=Todo w:the>
        <button w:on:onclick=todoDelete>-</button> 
        <span w:text=name>Todo 1</span>
      </li>
...
```

In the `.js` file, let's register a "type-handler". (The "assignment" performs the registration.)    
The name of the type-handler is given by the `$name` field.    
In the type-handler, we define the `todoDelete` event-handler, as a simple function. 

```js
W$TYPE={ $name:'Todo',
  todoDelete: function(el,ev,arg){ 
    var list=w$list(el); list.splice(list.indexOf(this),1) // using JS    
    // w$weave(el,'-')  // using "- weaving"  
  },      
};
```

1. `el`: the HTML element of the bond type, i.e., the `<li class=Todo` ...
2. `w$list(el)`: getting the outer iterated list for the element.
3.  `this`: accessing the current data.
4. `list.splice(list.indexOf(this),1)`: removing the element from the array.
5. The `var list=w$list(el); list.splice(list.indexOf(this),1)` line can be replaced by a "- weaving", that is `w$weave(el,'-')`.

Refreshing the page in a browser, and clicking to the '-' button, the item will be removed, and furthermore, because of the two-way data-binding, the counter is also updated.

We can add another type-handler (this is not an assignment but a type-handler registration):

```js
W$TYPE={ $name:'TodoList',
  todoAdd: function(el,ev,arg){  
    this.list.push(arg);
  },          
};
```

In the HTML, we use the `w:name` 'super-template' technique for the form. The event-handler will have the arguments, what we can simple add to the array. After the modification the HTML is actualized, at once.

```html
...
    <blockquote>
      <form w:name="todoAdd">
        <input type=text name=name size=20> 
        <button>+</button>
      </form>
    </blockquote>
  </div> 
</body>
```

### Prototype-binding ###

Let's extend the '.js' file. The `toNew` transformation of the `TodoList` type-handler creates a new (now empty) item.
In the `Todo` type-handler let's put the `name$required:true` and `name$length:64` fields.

```js
...
W$TYPE={ $name:'TodoList',
  toNew: function(el,v,arg){
    return { };
  },
  todoAdd: function(el,ev,arg){  
    this.list.push(arg);
  },          
};
W$TYPE={ $name:'Todo',
  name$required: true,
  name$length: 64,
  todoDelete: function(el,ev,arg){ 
    w$weave(el,'-');
  },      
};
```

Let's change the form, as well. The `toNew` transformation creates a new element, and the `w:type` sets its prototype. Changing the `name=name` of the input element to `w:name=name` the super-template technique will be used, thus the required and maxlength attributes will be set, too.
(The field-type related attributes can be given in a separate js file, e.g., a server-program can generate them from a description, what can be also used on the server to check field types and other arguments.)   

Using the `winput` CSS class, the postfix `<sup></sup>` will indicate if there's an error.

```html
...
    <blockquote>
      <form w:name="todoAdd" w:the="[toNew]" w:type=Todo>
        <input type=text class=winput w:name=name size=20><sup></sup>
        <button>+</button>
      </form>
    </blockquote>
  </div> 
</body>
```

### Putting it together ###

The `.js` file:

```js
W$DATA={ 
  data:{ title:'My list' },
  list: [
	  { name: 'clean the house' },
	  { name: 'buy milk' },
	]
};

W$TYPE={ $name:'TodoList',
  toNew: function(el,v,p){
    return { };
  },
  todoAdd: function(el,ev,op){  
    this.list.push(op);
  },          
};
W$TYPE={ $name:'Todo',
  name$required: true,
  name$length: 64,
  todoDelete: function(el,ev,arg){ 
    // var list=w$list(el); list.splice(list.indexOf(this),1)  // using JS
    w$weave(el,'-');    // using "weaving"
  },      
};
```

The HTML:
```html
<!DOCTYPE html>
<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>Weaveworld To Do List</title>
  <script src="https://cdn.jsdelivr.net/gh/weaveworld/Weaveworld/w.min.js"></script>
  <link href="https://cdn.jsdelivr.net/gh/weaveworld/Weaveworld/w.css" rel="stylesheet"/>
  <script src="simple-todo.js"></script>
  <script>
    // W$DATA=undefined
  </script>
</head>
<body>
  <div class=TodoList w:the>
    <h3><span w:text=data.title>To Do List</span> 
      <sup w:text="({{list.length|'-'}})">(2)</sub>
    </h3>
    <ul w:each=list>
      <li class=Todo w:the>
        <button w:on:onclick=todoDelete>-</button> 
        <span w:text=name>Todo 1</span>
      </li>  
      <li w:the>
        <button>-</button> 
        <span>Todo 2</span>
      </li>
    </ul>
    <blockquote>
      <form w:name="todoAdd" w:the=[toNew] w:type=Todo>
        <input type=text class=winput w:name=name size=20><sup></sup>
        <button>+</button>
      </form>
    </blockquote>
  </div> 
</body>
</html>
```
Uncommenting the `W$DATA=undefined`, the raw HTML with example data will be shown.