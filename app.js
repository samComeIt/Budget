// use modules -> bc -> keep pieces of code that are related

var bugetController = (function() {
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };
    
    //Store in array
    var data = { // global data model
        allItems: {
            exp:[],
            inc:[]
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 //nonexistence
    };
    
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            //Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
             
            } else {
                 ID = 0;
            }
           
            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            //Push it into our data stucture
            data.allItems[type].push(newItem);
            
            //Return the new element
            return newItem;
        },
        
        calculateBudget: function(){
          // calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of inc that we spent
            if(data.totals.inc > 0){
               data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            }else {
                data.percentage = -1;
            }
            
        },
        
        getBudget: function() {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          };  
        },
        
        testing: function(){
            console.log(data);
        }
    };
})();



var UIController = (function() {
    
    var DOMstrings = { //private
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue:'.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
        
    };
    
    return {
      getinput: function() {
          return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
              //parseFloat change string to float
          //return 3 values same time  
          };
          
      },
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if(type === 'inc') {
                
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="income-0"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                
            element = DOMstrings.expenseContainer;
            html = '<div class="item clearfix" id="expense-0"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            
         fields =  document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);  
        
           fieldsArr =  Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value ="";
            });
            fieldsArr[0].focus();
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
    
    
    var updateBudget = function() {
        //5. Calculate the budget
        bugetCtrl.calculateBudget();
        //6. Return th budget
        var budget = bugetCtrl.getBudget();
        //7. Display the budget on the UI
        console.log(budget);
        
        
    };
    
    var ctrlAddItem = function(){
        var input, newItem;
       // 1. Get the filed input data
        input = UICtrl.getinput();
        //console.log(input);
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
          //2. Add the item to the budget controller
        newItem = bugetCtrl.addItem(input.type, input.description, input.value);
        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        // 4. Clear the fields
        UICtrl.clearFields();
        
        // 5. Calculate and update budget
        updateBudget();  
        } 
        
   };
    
    return {
        init: function(){
            console.log('Application has started');
            setupEventListeners();
        }
    };
    
})(bugetController, UIController);

controller.init();