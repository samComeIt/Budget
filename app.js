// use modules -> bc -> keep pieces of code that are related

var bugetController = (function() {
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0 ){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
      return this.percentage;  
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
        
        deleteItem: function(type, id){
            var ids, index;
            
            // id = 6
            // data.allItems[type][id] x
            // ids = [1 2 4 6 8]
            // index = 3
            
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            
            if (index !== -1){
                data.allItems[type].splice(index, 1);
                // [1 2 4 6 8] ==> [1 2 4 8] 
            } 
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
        
        calculatePercentages: function(){
          /*
          a = 20
          b = 10
          c = 40
          income = 100
          a = 20 / 100 
          b = 10 / 100
          c = 40 / 100
          */  
            
            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc); 
            });
        },
        
        getPercentages: function(){
        var allPerc = data.allItems.exp.map(function(cur){
            return cur.getPercentage();
            
        }); 
            return allPerc;
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        delete: '.item__delete',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
        
        
    };
    
    var formatNumber = function(num, type){ //private function
          // + or - before number 2.4567 -> + 2.4567
          // 2 decimal points 2.4567 -> + 2.46
          // comma separating the thousands 2000 -> + 2,000.00
            
            var numSplit, int, dec;
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            if (int.length > 3) {
                int = int.substr(0,int.length -3) + ',' + int.substr(int.length-3, 3);
            }
            
            
            dec = numSplit[1];
 
            return (type === 'exp' ? sign = '-' : '+') + ' ' + int +'.' + dec; 
        };
                    
    var nodeListForEach = function(list, callback){
              for (var i = 0; i < list.length; i++){
                  callback(list[i], i);
              }  
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
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                
            element = DOMstrings.expenseContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID){
            // remove a child
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
        
        displayBudget: function(obj) {
           var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
               document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
              
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            
            }
        },
        
        displayPercentages: function(percentages){
          var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); //Node List
        
            nodeListForEach(fields, function(current, index) {
                // Do stuff
                if (percentages[index] > 0){
                 current.textContent = percentages[index] + '%';
                   
                } else {
                    current.textContent ='---';
                
                }
                
            });
        },
        
        displayMonth: function() {
            var now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month]+', '+year;
        },
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue);
        
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    
    
    
    var updateBudget = function() {
        //5. Calculate the budget
        bugetCtrl.calculateBudget();
        //6. Return th budget
        var budget = bugetCtrl.getBudget();
        //7. Display the budget on the UI
        UICtrl.displayBudget(budget);  
        
    };
    
    var updatePercentage = function(){
      // 1. Calcuate percentages
        bugetCtrl.calculatePercentages();
        // 2. Read percentages from the budget controller
        var percentages = bugetCtrl.getPercentages();
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
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
        
            // 6. Calculate and update percentages
            updatePercentage();
        } 
        
   };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0]; //inc
            ID = parseInt(splitID[1]); //1,  type: string -> int
            
            // 1. delete the item from the data structure
            bugetCtrl.deleteItem(type, ID);
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
            // 4. Update and calcuate percenatges
            updatePercentage();
        }
    };
    
    return {
        init: function(){
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
             budget: 0,
              totalInc: 0,
              totalExp: 0,
              percentage: -1
            });
            setupEventListeners();
        }
    };
    
})(bugetController, UIController);

controller.init();