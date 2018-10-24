// budget controller
const budgetController = (function() {

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

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
    
    calculateBudget:function() {

      // calls a private functions that add up all the incomes and expenses and stores then inside the data object.
      calculateTotal('exp');
      calculateTotal('inc');

      //calc the budget by do income - expenses, then store the budget back in the data object
      data.budget = data.totals.inc - data.totals.exp;

      //calc the percentage of the income we spent, to display next to expenses 
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    // function will return an object which holds 4 values from the data object.
    getBudget:function() {
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
    expensesContainer: '.expenses__list'
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
        html = `<div class="item" id="income-${obj.id}"><div class="item__description">${obj.description}</div><div class="right "><div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__delete--btn">X</button></div></div></div>`
      } else if(type === 'exp') {
        element = DOMStrings.expensesContainer; //assign dom string to element
        html = `<div class="item " id="expense-${obj.id}"><div class="item__description">${obj.description}</div><div class="right"><div class="item__value">${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">X</button></div></div></div>`
      }

      //insert html into the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', html);

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
  }

  const updateBudget = function() { // called each time we enter a new item into the user interface

    // 1. calculate the budget and stores it in the data object
    budgetCtrl.calculateBudget();

    // 2. gets an object containing the budget, total income, total expense and percentage  
      let budget = budgetCtrl.getBudget();

    // 3. display budget
    console.log(budget);
  }


  //
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

      // clear the input fields
      UICntrl.clearFields();

      // calculate and update the budget
      updateBudget();
    }
  }

return {
  init: function() {
    console.log('The application has started');
    setupEventListeners();
  }
}

})(budgetController, UIController);

controller.init(); // starts program