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
	};

	const updateBudget = () => {
		// 1. Calculate the budget
		BudgetController.calculateBudget();
		// 2. Return the budget
		const budget = BudgetController.getBudget();
		// 3. Display the budget on UI
		UICtrl.displayBudget(budget);
	};

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
		}
	};

	return public;
})(BudgetController, UIController);

Controller.init();
