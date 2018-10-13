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

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      totalExp: 0,
      totalInc: 0
    }
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
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,// will be an income or expese 
        description: document.querySelector(DOMStrings.inputDescription).value,
        amount: document.querySelector(DOMStrings.inputAmount).value
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

 
  //
  const ctrlAddItem = function() {
  let input, newItem;

  // 1. get field input data
  input = UICntrl.getInput();
  // 2. add item to the budget controller
  newItem = budgetCtrl.addItem(input.type, input.description, input.amount);

  // 3. add item to UI
  UICntrl.addListItem(newItem, input.type);

  // 4. calc the budget


  // 5. display budget

  }

return {
  init: function() {
    console.log('The application has started');
    setupEventListeners();
  }
}

})(budgetController, UIController);

controller.init(); // starts program