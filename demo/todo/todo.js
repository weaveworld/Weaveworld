W$TYPE={ $name:'ToDo',
   newTodo: function(el,self){
     return { };
   },          
};
W$TYPE={ $name:'Item',
    itemDelete: function(el,ev,arg){
      w$weave(el,'-'); 
    },      
    itemAdd: function(el,ev,arg){ 
      if(!arg.text){
        alert("Please enter a todo!");
        return
      }
      const newId=Math.max.apply(null, w$list(el).map(t => t.id)) + 1;
      w$weave(el,']',{id:newId,text:arg.text});
      el.reset();
    }
};

W$DATA={ 
  list: [
    { id: 1, text: 'clean the house' },
    { id: 2, text: 'buy milk' }
  ]
};