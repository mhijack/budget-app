// ================ GLOBAL CONTROLLER ================
const Controller = ((budgetCtrl, UICtrl) => {
  const public = {};

  // initialization function
  public.init = () => {
    setupEventListeners();
    UICtrl.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: 0
    });
    UICtrl.displayMonth();
    console.log('Application started');
  };

  // setup EventListeners
  const setupEventListeners = () => {
    document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', event => {
      // If enter pressed
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    // Event listener for delete btn
    document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);

    // Event listener to change focus color when input changes
    document.querySelector(DOMStrings.inputType).addEventListener('change', event => {
      const inputArr = document.querySelectorAll(DOMStrings.inputType + ', ' + DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
      const inputBtn = document.querySelector(DOMStrings.inputBtn);

      UICtrl.nodeListForEach(inputArr, input => {
        input.classList.toggle(DOMStrings.redFocus);
        inputBtn.classList.toggle('red');
      })
    })
  };

  const updateBudget = () => {
    // 1. Calculate the budget
    BudgetController.calculateBudget();
    // 2. Return the budget
    const budget = BudgetController.getBudget();
    // 3. Display the budget on UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = () => {
    // 1. Calculate percentage
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from budgetController
    const percentages = budgetCtrl.getPercentages();
    // 3. Update UI
    UICtrl.displayPercentages(percentages);
  }

  const ctrlDeleteItem = event => {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    // Only proceed if ID is defined (clicked on delete button)
    if (itemID) {
      // 'inc-1'
      splitID = itemID.split('-')
      type = splitID[0];
      ID = splitID[1];
      // 1. Delete item from data structure
      budgetCtrl.deleteItem(ID, type);
      // 2. Delete item from UI
      UICtrl.deleteListItem(itemID);
      // 3. Update and show new budget
      updateBudget();
      // 4. Calculate and update percentages
      updatePercentages();
    }
  }

  // stores DOMStrings
  const DOMStrings = UICtrl.getDOMStrings();

  const ctrlAddItem = () => {
    let input, newItem;
    // 1. Get filled input data
    input = UICtrl.getInput();
    // Check for valid input
    if (input.description !== '' && input.value !== 0 && !isNaN(input.value)) {
      // 2. Add item to budget controller (save in database and give it ID)
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear input fields
      UICtrl.clearFields();
      // 5. Calculate and update budget
      updateBudget();
      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  return public;
})(BudgetController, UIController);

Controller.init();
