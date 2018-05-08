// ================ BUDGET CONTROLLER ================
const budgetController = (() => {
	class Expense {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}
	}

	class Income {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}
	}

	// Data structure
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
		percentage: null
	};

	// calculate total amount depending on 'inc' or 'exp'
	const calculateTotal = type => {
		let sum = 0;
		for (let item of data.allItems[type]) {
			sum += item.value;
		}
		data.totals[type] = sum;
		return sum;
	};

	// Add new Expense or Income into data structure
	const addItem = (typ, desc, val) => {
		let newItem, ID;

		// Create new ID
		ID = data.allItems[typ].length > 0 ? data.allItems[typ][data.allItems[typ].length - 1].id + 1 : 0;

		// Create new item based on 'inc' or 'exp' type
		if (typ === 'exp') {
			newItem = new Expense(ID, desc, val);
		} else if (typ === 'inc') {
			newItem = new Income(ID, desc, val);
		}

		// Push into data structure
		data.allItems[typ].push(newItem);

		// Return new item
		return newItem;
	};

	const calculateBudget = () => {
		// Calculate total income and expenses
		calculateTotal('inc');
		calculateTotal('exp');

		// Calculate the budget: income - expenses
		data.budget = data.totals.inc - data.totals.exp;

		// Calculate percentage: expense / income (only calculate if income not 0)
		data.totals.inc > 0
			? (data.percentage = Math.round(data.totals.exp / data.totals.inc * 100))
			: (data.percentage = -1);
	};

	const getBudget = () => {
		return {
			budget: data.budget,
			totalInc: data.totals.inc,
			totalExp: data.totals.exp,
			percentage: data.percentage
		};
	};

	return {
		addItem,
		calculateBudget,
		getBudget,
		testing: () => {
			console.log(data);
		}
	};
})();

// ================ UI CONTROLLER ================
const UIController = (() => {
  // DOM classes for element selection
	const DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage'
	};

	// clear input field
	const clearFields = () => {
		let fields;
		// Select all input fields
		fields = Array.prototype.slice.call(
			document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`)
		);
		// Loop through array and clear all fields
		for (let field of fields) {
			field.value = '';
		}
		fields[0].focus();
	};

	// Display budget
	const displayBudget = obj => {
		document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
		document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
		document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
		obj.percentage > 0
			? (document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%')
			: (document.querySelector(DOMStrings.percentageLabel).textContent = '---');
	};

	// Add new item to DOM list
	const addListItem = (obj, type) => {
		let html, newHtml, element;
		// Create HTML string with placeholder text
		if (type === 'inc') {
			element = DOMStrings.incomeContainer;
			html =
				'<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" /></button></div></div></div>';
		} else if (type === 'exp') {
			element = DOMStrings.expenseContainer;
			html =
				'<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		}
		// Replace placeholder text with data from obj
		newHtml = html.replace('%id%', obj.id);
		newHtml = newHtml.replace('%description%', obj.description);
		newHtml = newHtml.replace('%value%', obj.value);
		// Insert HTML into DOM
		document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
	};

  // Retrieve user input
	const getInput = () => {
		return {
			// check if inc(rement) or exp(ense)
			type: document.querySelector(DOMStrings.inputType).value,
			// description
			description: document.querySelector(DOMStrings.inputDescription).value,
			// value (in string)
			value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
		};
	};

  // Expose DOM strings to public
	const getDOMStrings = () => {
		return DOMStrings;
	};

	return { getDOMStrings, getInput, addListItem, clearFields, displayBudget };
})();

// ================ GLOBAL CONTROLLER ================
const controller = ((budgetCtrl, UICtrl) => {
	// initialization function
	const init = () => {
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
		budgetController.calculateBudget();
		// 2. Return the budget
		const budget = budgetController.getBudget();
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

	return {
		init
		// ctrlAddItem
	};
})(budgetController, UIController);

controller.init();
