// BUDGET CONTROLLER
const budgetController = (() => {

  // TODO

})();

// UI CONTROLLER
const UIController = (() => {

  return {
    getInput
  }

})();

// GLOBAL CONTROLLER
const controller = ((budgetCtrl, UICtrl) => {

  const ctrlAddItem = () => {

    // 1. Get filled input data

    // 2. Add item to budget controller

    // 3. Add item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on UI
    console.log('added')
  }

  document
    .querySelector('.add__btn')
    .addEventListener('click', ctrlAddItem)

  document.addEventListener('keypress', event => {

    // If enter pressed
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }

  })

})(budgetController, UIController);
