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
    // var list=w$list(el); list.splice(list.indexOf(this),1) // using JS      
    w$weave(el,'-');  // using 'weaving'  
  },      
};
