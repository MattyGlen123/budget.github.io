// budget controller
const budgetController = (function() {

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expense.prototype.calcPercentage = function(totalinc) {

    if(totalinc > 0) {
      this.percentage = Math.round((this.value / totalinc) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  // pass in the array of income or expenses, adds the total of all items added together to the data object.totals
  calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(cur => {
      sum += cur.value;
    });
    data.totals[type] = sum;
  }

  // holds every expense and incomes obj with unique ids and desciptions
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1   // if there are no income or expenses then percentage equal -1 so it dosent exist 
  };

  return {
    addItem: function(type, des, val) { //types recived will be inc or exp
      let newItem, ID;

      //create new id
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      } else {
        ID = 0;
      }

      //recreate new item based on type passed in, inc || exp
      if(type === 'exp') { //check type and create a object for the item
        newItem = new Expense(ID, des, val);
      } else if(type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      
      // add items to data structure
      data.allItems[type].push(newItem);

      //return new element
      return newItem;

    },
    
    deleteItem: function(type, id) {
      
      let ids = data.allItems[type].map(item => item.id);

      let index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget:function() {

      // calls a private functions that add up all the incomes and expenses and stores then inside the data object.
      calculateTotal('exp');
      calculateTotal('inc');

      //calc the budget by do income - expenses, then store the budget back in the data object
      data.budget = data.totals.inc - data.totals.exp;

      if(data.totals.inc > 0) {
        //calc the percentage of the income we spent, to display next to expenses 
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else  {
        data.percentage = -1; // 
      }

    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(cur => cur.calcPercentage(data.totals.inc));
    },

    getPercentages: function() {
      let allPerc = data.allItems.exp.map(cur => cur.getPercentage());
      return allPerc;
    },

    // function will return an object which holds 4 values from the data object.
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() { //testing
      console.log(data);
    }
  }

})();



// User Interface Controller
const UIController = (function() {
  
  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputAmount: '.add__value',
    btnAdd: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  const formatNumber = function(num, type) {
    // + or - before all numbers
    // each numbers has 2 decimal places
    // comma seperating the thousands
    num = Math.abs(num);
    num = num.toFixed(2);
    let numSplit = num.split('.');

    let int = numSplit[0];
    let dec = numSplit[1];

    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 23500 => 23,500
    }

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  const nodeListForEach = function(list, callback) {
    for(let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function() { //return an object with 3 values, is stored in the data obj under a 'type'
      return {
        type: document.querySelector(DOMStrings.inputType).value,// will be an income or expese 
        description: document.querySelector(DOMStrings.inputDescription).value,
        amount: parseFloat(document.querySelector(DOMStrings.inputAmount).value)
      };
    },

    addListItem: function(obj, type) {
      let html, element;
      // create html using placeholder text and add obj values
      if(type === 'inc') {
        element = DOMStrings.incomeContainer; //assign dom string to element
        html = `<div class="item" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right "><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__delete"><button class="item__delete--btn">X</button></div></div></div>`
      } else if(type === 'exp') {
        element = DOMStrings.expensesContainer; //assign dom string to element
        html = `<div class="item " id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">X</button></div></div></div>`
      }

      //insert html into the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', html);

    },

    // pass in id as apears in DOM eg inc-1
    deleteListItem: function(selectorID) {
      let element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    clearFields: function() {
      let fields;

      // get the description and value input fields
      fields = Array.from(document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputAmount}`));
      
      // reset the input fields to empty
      fields.forEach(cur => cur.value = '');

      // reset the focus back to the descriptions
      fields[0].focus();
    },

    displayBudget: function(obj) { // recives the budget, total income, total expenses and percentage 
      let type;
      obj.budget > 0 ? type = 'inc': type = 'exp';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      
      // display the percentage only it's positive
      if(obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "--";
      }
    },

    displayPercentages: function(percentages) {

      let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      nodeListForEach(fields, function(current, i) {
        if(percentages[i] > 0 ) {
          current.textContent = percentages[i] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      let now = new Date();
      let month = now.getMonth();
      let year = now.getFullYear();

      document.querySelector(DOMStrings.dateLabel).textContent = month + " " + year;
    },

    changedType: function() {
      
      const fields = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputDescription + ',' +
        DOMStrings.inputAmount
      );

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMStrings.btnAdd).classList.toggle('red');
    },

    getDOMStrings: function() { //expose DOM strings into controller
      return DOMStrings;
    } 
  };

}) ();



// Global App Controller
const controller = (function(budgetCtrl, UICntrl) {

  //Holds all Event listeners
  const setupEventListeners = function() {
    const DOMStr = UICntrl.getDOMStrings();

    document.querySelector(DOMStr.btnAdd).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOMStr.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOMStr.inputType).addEventListener('change', UICntrl.changedType);
  }

  const updateBudget = function() { // called each time we enter a new item into the user interface

    // 1. calculate the budget and stores it in the data object
    budgetCtrl.calculateBudget();

    // 2. gets an object containing the budget, total income, total expense and percentage  
    let budget = budgetCtrl.getBudget();

    // 3. display budget
    UICntrl.displayBudget(budget);
  }

  const updatePercentages = function() {

    // 1. Calculate Percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentage from the budget control
    let percentages = budgetCtrl.getPercentages();
    // 3. Update the UI with the new percentages
    UICntrl.displayPercentages(percentages);

  }

  const ctrlAddItem = function() { // called everytime a new item is entered
    let input, newItem;

    // 1. get field input data
    input = UICntrl.getInput();

    // validate inputs, checks description has a word input and the amount input is a number greater than zero 
    if(input.description !== "" && !isNaN(input.amount) && input.amount !== 0) {
      // 2. add item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.amount);

      // 3. add item to UI
      UICntrl.addListItem(newItem, input.type);

      // 4. clear the input fields
      UICntrl.clearFields();

      // 5. calculate and update the budget
      updateBudget();

      // 6. calculate and update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function(event) {
    // when delete is clicked store id of item container eg income-0
    let itemID = event.target.parentNode.parentNode.parentNode.id;

    if(itemID) {
      // eg splitID = ['inc', '1']
      let splitID = itemID.split('-');
      let type = splitID[0];
      let ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. remove the item from the ui
      UICntrl.deleteListItem(itemID);

      // 3. update and show new budget
      updateBudget();

      // 4. calculate and update percentages
      updatePercentages();
    }
  };

return {
  init: function() {
    console.log('The application has started');
    UICntrl.displayMonth();
    UICntrl.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: -1
    }); // reset everything to 0
    setupEventListeners();
  }
}

})(budgetController, UIController);

controller.init(); // starts program