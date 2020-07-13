// use modules -> bc -> keep pieces of code that are related

var bugetController = (function() {
    
})();

var UIController = (function() {
    
    var DOMstrings = { //private
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue:'.add__value',
        inputBtn: '.add__btn'
    };
    
    return {
      getinput: function() {
          return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
          //return 3 values same time  
          };
          
      },
        getDOMstrings: function(){ //expose to public
            return DOMstrings; 
        }
    };
})();

var controller = (function(bugetCtrl, UICtrl) {
    
    var setupEventListeners = function(){
       
       var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
    };
    
    
    
    var ctrlAddItem = function(){
       // 1. Get the filed input data
        var input = UICtrl.getinput();
       
        //2. Add the item to the budget controller
        
        //3. Add the item to the UI
        
        //4. Calculate the budget
        
        //5. Display the budget on the UI
       
   };
    return {
        init: function(){
            console.log('Application has started');
            setupEventListeners();
        }
    };
    
})(bugetController, UIController);

controller.init();